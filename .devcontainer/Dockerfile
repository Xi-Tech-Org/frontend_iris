FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-22.04

# 安裝必要的系統工具，包括 ps 命令
RUN apt-get update && apt-get install -y procps && apt-get clean

# 設定時區為亞洲/台北
RUN ln -fs /usr/share/zoneinfo/Asia/Taipei /etc/localtime
