#!/bin/bash
echo "start build ..."
declare -A region=(
["iris_dev"]='ap-southeast-1'
["iris_stg"]='ap-southeast-1'
["iris_prod"]='ap-southeast-1'
)
declare -A bucket=(
["iris_dev"]='xitech-iris-client'
["iris_stg"]='xitech-iris-client'
["iris_prod"]='xitech-iris-client'
)
declare -A apiurl=(
["iris_dev"]='https://admin-dev.iris.xitech.com'
["iris_stg"]='https://admin-stg.iris.xitech.com'
["iris_prod"]='https://admin.iris.xitech.com'
)

declare -A cdncache=(
["iris_dev"]='E3ER3B7RTIRCG8'
["iris_stg"]='E3ER3B7RTIRCG8'
["iris_prod"]='E3ER3B7RTIRCG8'
)