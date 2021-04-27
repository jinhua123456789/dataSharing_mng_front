FROM node
# Copy application code.
COPY . /dist/
# Install dependencies.
RUN npm install -g http-server
# 工作目录
WORKDIR /dist/
# 工作目录 执行的命令
CMD ["http-server"]
