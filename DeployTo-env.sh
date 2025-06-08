#!/bin/bash
echo "start build ..."
declare -A region=(
["iris_dev"]='ap-southeast-1'
["iris_stg"]='ap-southeast-1'
["iris_prod"]='ap-southeast-1'
)
declare -A bucket=(
["iris_dev"]='xitech-client'
["iris_stg"]='xitech-client'
["iris_prod"]='xitech-client'
)
declare -A apiurl=(
["iris_dev"]='https://admin-dev.iris.xitech.com'
["iris_stg"]='https://admin-stg.iris.xitech.com'
["iris_prod"]='https://admin.iris.xitech.com'
)

declare -A cdncache=(
["iris_dev"]='EMA1AYEPUV9SN'
["iris_stg"]='EMA1AYEPUV9SN'
["iris_prod"]='EMA1AYEPUV9SN'
)