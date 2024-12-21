启用 [Fabric 服务器](https://fabricmc.net/) 模式，通过在命令行中添加 `-e TYPE=FABRIC` 来实现。

```
docker run -d -v /path/on/host:/data \
    -e TYPE=FABRIC \
    -p 25565:25565 -e EULA=TRUE --name mc itzg/minecraft-server
```

默认情况下，容器将安装最新的 [Fabric 服务器启动器](https://fabricmc.net/use/server/)，使用最新的 [Fabric 加载器](https://fabricmc.net/wiki/documentation:fabric_loader) 针对您通过 `VERSION` 定义的 Minecraft 版本（默认为游戏的最新原版发布版本）。

可以通过 `FABRIC_LOADER_VERSION` 和 `FABRIC_LAUNCHER_VERSION` 分别请求特定版本的加载器或启动器，例如：

```
docker run -d -v /path/on/host:/data ... \
    -e TYPE=FABRIC \
    -e FABRIC_LAUNCHER_VERSION=0.10.2 \
    -e FABRIC_LOADER_VERSION=0.13.1
```

!!! note "注意"

    如果您希望使用替代启动器，您可以：

    - 提供自定义启动器 jar 的路径，该路径可用于容器，相对于 `/data`（例如 `-e FABRIC_LAUNCHER=fabric-server-custom.jar`）
    - 提供自定义启动器 jar 的 URL，使用 `FABRIC_LAUNCHER_URL`（例如 `-e FABRIC_LAUNCHER_URL=http://HOST/fabric-server-custom.jar`）

请参阅 [使用模组和插件](../../mods-and-plugins/index.md) 部分以设置 Fabric 模组和配置。