#选择基础镜像(基于此镜像创建)

        FROM node:12.0.0-alpine

        #将当前目录中所有文件都加入需要制作的镜像中的/fee目录中

        ADD . /dy-note

        #设置当前工作目录

        WORKDIR  /dy-note

        #加载依赖包

        RUN npm install

        #定义镜像对外端口

        EXPOSE 2022

        #默认时间不是国内的，设置为上海（待测-apline版本中，由于精简，需要通过apk安装）

        RUN apk update && apk add bash tzdata && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

        #运行程序(在docker run的时候调用)

        CMD ["node","app"]