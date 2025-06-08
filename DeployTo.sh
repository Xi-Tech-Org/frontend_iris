#!/bin/bash
# 秀出 目前 Github 大部分的內建變數
echo "GITHUB_SHA: $GITHUB_SHA"
echo "GITHUB_REPOSITORY: $GITHUB_REPOSITORY"
echo "GITHUB_REF: $GITHUB_REF"
echo "GITHUB_REF_NAME: $GITHUB_REF_NAME"
echo "GITHUB_WORKFLOW: $GITHUB_WORKFLOW"
echo "GITHUB_ACTION: $GITHUB_ACTION"
echo "GITHUB_ACTOR: $GITHUB_ACTOR"
echo "GITHUB_RUN_ID: $GITHUB_RUN_ID"
echo "GITHUB_RUN_NUMBER: $GITHUB_RUN_NUMBER"
echo "GITHUB_JOB: $GITHUB_JOB"
echo "GITHUB_EVENT_NAME: $GITHUB_EVENT_NAME"
echo "GITHUB_SERVER_URL: $GITHUB_SERVER_URL"
echo "GITHUB_API_URL: $GITHUB_API_URL"
echo "GITHUB_WORKSPACE: $GITHUB_WORKSPACE"

# 載入環境變數設定
source ./DeployTo-env.sh

# 設定 CommitID
CommitID="${GITHUB_SHA:0:7}"

# 處理 BUILD_TAG
# 如果是標籤，則使用標籤名稱
if [[ "$GITHUB_REF" == refs/tags/* ]]; then
    BUILD_TAG=${GITHUB_REF#refs/tags/}
    echo "使用標籤作為 BUILD_TAG: $BUILD_TAG"
# 如果是分支，則使用分支名稱
elif [[ "$GITHUB_REF" == refs/heads/* ]]; then
    BUILD_TAG=${GITHUB_REF#refs/heads/}
    echo "使用分支名稱作為 BUILD_TAG: $BUILD_TAG"
# 其他情況，使用 GITHUB_REF_NAME
elif [ -n "$GITHUB_REF_NAME" ]; then
    BUILD_TAG="$GITHUB_REF_NAME"
    echo "使用 GITHUB_REF_NAME 作為 BUILD_TAG: $BUILD_TAG"
# 如果都無法取得，則使用 CommitID
else
    BUILD_TAG="$CommitID"
    echo "使用 CommitID 作為 BUILD_TAG: $BUILD_TAG"
fi

VERSION="0.0.0"

# 提取 GITHUB_REPOSITORY 中的倉庫名稱部分（不包含擁有者）
REPO_NAME="${GITHUB_REPOSITORY#*/}"
echo "Repository Name: $REPO_NAME"
# 檢查參數
if [ $# -lt 1 ]; then
    echo "用法: $0 <環境> [版本號]"
    echo "環境選項: iris_dev, iris_stg, iris_prod"
    echo "例如: $0 iris_dev"
    echo "或者: $0 iris_stg 1.2.3"
    # 在 GitHub Actions 中透過 push 觸發時，預設使用 iris_dev 環境
    ENV="iris_dev"
    echo "沒有提供參數，預設使用環境: $ENV"
else
    ENV=$1
    echo "使用環境: $ENV"  
fi

# 處理版本號
if [ "$ENV" != "iris_dev" ]; then
    # STG 和 PROD 環境
    if [ $# -ge 2 ]; then
        # 如果提供了版本號參數，則使用它
        VERSION=$2
    else
        # 如果沒有提供版本號，使用預設值
        VERSION="1.0.0"
        echo "使用預設版本號: $VERSION"
    fi
    
    # 檢查版本號格式
    if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "錯誤: 無效的版本號格式 '$VERSION'"
        echo "版本號應該是 x.y.z 格式"
        exit 1
    fi
fi

# 更新環境文件中的版本號和構建標籤
if [ "$ENV" != "iris_dev" ]; then
    # Dev 不覆蓋版本號
    sed -i "s/VITE_VERSION=.*/VITE_VERSION=$VERSION/" .env.$ENV
fi
sed -i "s/VITE_BUILD_TAG=.*/VITE_BUILD_TAG=$BUILD_TAG/" .env.$ENV
sed -i "s/VITE_BUILD_HASH=.*/VITE_BUILD_HASH=$CommitID/" .env.$ENV

echo "已更新 .env.$ENV 文件:"
echo "VITE_VERSION=$VERSION"
echo "VITE_BUILD_TAG=$BUILD_TAG"
echo "VITE_BUILD_HASH=$CommitID"

# 執行構建
echo "開始構建 $ENV 環境..."

ContainerName=frontend-iris
DeployToEnv=$ENV
docker stop ${ContainerName}
docker rm ${ContainerName}
docker run -w /app --oom-kill-disable --name ${ContainerName} -v $(pwd):/app public.ecr.aws/docker/library/node:22.16.0  "bash" "-c" "npm install && npm run build"


[[ ! -f dist/index.html ]] && exit 1

echo "generate version file ..."
echo "{
    \"HashTag\":\"${BUILD_TAG}\",
    \"CommitID\":\"${CommitID}\",
    \"VERSION\":\"${VERSION}\",
    \"DeployTo\":\"${DeployToEnv}\",
    \"buildTime\":\"$(date '+%Y%m%d %H:%M:%S')\"
}" > ./dist/version.json

echo "start publish ..."
ls -l ./dist
echo "aws --region ${region["${DeployToEnv}"]} s3 sync ./dist s3://${bucket["${DeployToEnv}"]}/${REPO_NAME}/${DeployToEnv} "
aws --region ${region["${DeployToEnv}"]} s3 sync ./dist s3://${bucket["${DeployToEnv}"]}/${REPO_NAME}/${DeployToEnv} 
aws cloudfront create-invalidation --distribution-id ${cdncache["${DeployToEnv}"]} --paths '/*'