# 介绍
这个 Docker 镜像提供了一个 Minecraft 服务器，它会在启动时自动下载最新稳定版本。你也可以运行或升级到任何特定版本或最新的快照。有关更多信息，请参阅下面的 _版本_ 部分。

要简单地使用最新稳定版本，运行：

    docker run -d -it -p 25565:25565 -e EULA=TRUE itzg/minecraft-server

在这种情况下，标准服务器端口 25565 将在你的主机上暴露 。

!!! note "注意"

    如果你计划运行一个长期的服务器，强烈建议使用管理层，如 [Docker Compose](#使用-docker-compose) 或 [Kubernetes](#部署模板和示例)，以允许增量重新配置和镜像升级。

!!! info "信息"

    请务必始终在你的命令和容器定义中包含 `-e EULA=TRUE`，因为 Mojang/Microsoft 要求接受 EULA。

!!! warning "警告"

    **不要** 在 25575 端口上转发 RCON，除非你首先将 `RCON_PASSWORD` 设置为安全值。强烈建议仅在容器内使用 RCON，例如使用 `rcon-cli`。

默认情况下，容器将下载由 Mojang 提供的最新版本的 "原版" [Minecraft: Java 版服务器](https://www.minecraft.net/en-us/download/server)。可以通过配置 [`VERSION`](versions/java.md) 和 [`TYPE`](types-and-platforms/index.md) 来创建多种所需的 Minecraft 服务器。

## 使用 [Docker Compose](https://docs.docker.com/compose/)

1. 创建一个新目录
2. 将以下文件内容放入一个名为 `docker-compose.yml` 的文件中
3. 在该目录中运行 `docker compose up -d`
4. 完成！将你的客户端指向你的主机名/IP 地址和端口 25565。

```yaml
services:
  mc:
    image: itzg/minecraft-server
    tty: true
    stdin_open: true
    ports:
      - "25565:25565"
    environment:
      EULA: "TRUE"
    volumes:
      # 将相对目录 'data' 挂载到容器的 /data 路径
      - ./data:/data
```

要应用对 compose 文件所做的更改，只需再次运行 `docker compose up -d`。

使用 `docker compose logs -f` 查看容器的日志，使用 `docker compose ps` 检查状态，并使用 `docker compose stop` 停止容器。

!!! note "更多 Compose 示例"

    更多 [示例位于 Github 仓库中](https://github.com/itzg/docker-minecraft-server/tree/master/examples)。

!!! note "部署示例"

    [部署页面](misc/deployment/index.md) 提供了更多使用 Docker Compose 及以外的部署示例。