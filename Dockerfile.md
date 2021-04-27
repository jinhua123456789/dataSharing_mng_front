# vue.config.js 设置
服务器IP

      (公网) 39.105.25.16

      (内网) 172.17.127.72

#开发环境Docker
## 开发环境Dockerfile
```
FROM daocloud.io/node:10
RUN mkdir -p /opt/apps/pcs
COPY .  /opt/apps/pcs
WORKDIR /opt/apps/pcs
ENV LANG C.UTF-8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo Asia/Shanghai > /etc/timezone
RUN npm install -g vue-cli
RUN npm install
EXPOSE 9547
```

## 打包命令
```
sudo bash docker.sh
# 合并了打包命令
```

```
sudo docker build -t pcs-sys .
```

#生产环境Docker
## 生产环境Dockerfile

```
npm install
FROM node
# Copy application code.
COPY . /dist/
# Install dependencies.
RUN npm install -g http-server
# 工作目录
WORKDIR /dist/
# 工作目录 执行的命令
CMD ["http-server"]
```
## build
```
npm run build:prod
```
## 复制Dockerfile 到dist文件夹
```
cp Dockerfile  dist/Dockerfile
```
## 打包
```
cd dist
sudo docker build -t sys-ui .
```
## docker 命令
```
运行容器
sudo docker run -p 8019:8080 --name sys-ui -d sys-ui

停止容器
sudo docker stop sys-ui

删除容器
sudo docker rm sys-ui


```
# 阿里云上传

## 登录（仅第一次需要）
```
sudo docker login --username=pwalan registry.cn-hangzhou.aliyuncs.com
```

## 打tag
```
sudo docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:[镜像版本号]

例如 ：
sudo docker tag 889c6f288b2a registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui

[ImageId]为镜像id 通过 sudo docker images 查看,build之后也会在末尾出现

```

## push 到私有云
```
sudo docker push registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:[镜像版本号]

例如 ： 
sudo docker push registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui

```
## 阿里云 启动
```
ssh root@39.105.25.16
Yang1290
./pcs/eureka.sh
./pcs/evaluation.sh
./pcs/exam.sh
./pcs/gateway.sh
./pcs/homepage.sh
./pcs/orgui.sh
./pcs/platform.sh
./pcs/scale.sh
./pcs/statistic.sh
./pcs/system.sh
./pcs/sysui.sh
```

## 实时查看docker容器日志
```
$ sudo docker logs -f -t --tail 行数 容器名

## docker.sh v1
```
npm install
npm run build:prod
cp Dockerfile  dist/Dockerfile
cd dist
sudo docker build -t sys-ui . > ../docker.log
cd ..
dockerId=`cat docker.log | tail -2 | head -1 |cut -d " " -f 3`
echo $dockerId
sudo docker tag $dockerId registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui
sudo docker push registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui
```

## docker.sh v2
```
npm install
npm run build:prod
cp Dockerfile  dist/Dockerfile
cd dist
sudo docker build -t sys-ui . 
sudo docker tag sys-ui:latest registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui
sudo docker push registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui
```