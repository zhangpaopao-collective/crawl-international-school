# 使用 Node.js 官方提供的基础镜像
FROM node:18

# 创建应用目录
WORKDIR /usr/src/app

# 安装 pnpm 和 pm2
RUN npm install -g pnpm pm2

# 复制 package.json 和 pnpm-lock.yaml 到工作目录
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制所有文件到工作目录
COPY . .

# 构建应用
RUN pnpm build

# 暴露端口 3000
EXPOSE 3000

# 运行应用
CMD [ "pm2-runtime", "start", ".output/server/index.mjs" ]