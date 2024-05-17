# 定义镜像和容器的名称
IMAGE_NAME="international-school"
CONTAINER_NAME="international-school-container"

# 检查是否存在同名的容器
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    # 如果容器正在运行，则停止它
    docker stop $CONTAINER_NAME
    # 删除容器
    docker rm $CONTAINER_NAME
fi

# 检查是否存在同名的镜像
if [ "$(docker images -q $IMAGE_NAME)" ]; then
    # 删除镜像
    docker rmi $IMAGE_NAME
fi

# 构建镜像
docker build -t $IMAGE_NAME .

# 运行容器
docker run -p 6001:3000 --name $CONTAINER_NAME -d $IMAGE_NAME