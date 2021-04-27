docker rmi registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui
npm install
npm run build:prod
cp Dockerfile  dist/Dockerfile
cd dist
sudo docker build -t sys-ui .
sudo docker tag sys-ui:latest registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui
sudo docker push registry.cn-hangzhou.aliyuncs.com/xnt-pcs/pcs:sys-ui
