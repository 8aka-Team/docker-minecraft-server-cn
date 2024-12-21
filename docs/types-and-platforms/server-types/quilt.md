启用[Quilt服务器](https://quiltmc.org/)模式，通过在命令行中添加`-e TYPE=QUILT`。

```
docker run -d -v /path/on/host:/data \
    -e TYPE=QUILT \
    -p 25565:25565 -e EULA=TRUE --name mc itzg/minecraft-server
```

默认情况下，容器将安装最新的[quilt服务器启动器](https://quiltmc.org/install/server/)，使用最新的[quilt-installer](https://github.com/QuiltMC/quilt-installer)针对您使用`VERSION`定义的Minecraft版本（默认为游戏的最新原版发布版本）。

可以通过`QUILT_LOADER_VERSION`和`QUILT_INSTALLER_VERSION`分别请求特定版本的加载器或安装程序，例如：

```
docker run -d -v /path/on/host:/data ... \
    -e TYPE=QUILT \
    -e QUILT_LOADER_VERSION=0.16.0 \
    -e QUILT_INSTALLER_VERSION=0.4.1
```

!!! note "注意"

    如果您希望使用替代启动器，您可以：

    - 使用`QUILT_LAUNCHER`提供容器可访问的自定义启动器jar的路径，相对于`/data`（例如`-e QUILT_LAUNCHER=quilt-server-custom.jar`）
    - 使用`QUILT_LAUNCHER_URL`提供自定义启动器jar的URL（例如`-e QUILT_LAUNCHER_URL=http://HOST/quilt-server-custom.jar`）

请参阅[使用模组和插件](../../mods-and-plugins/index.md)部分以设置Quilt模组和配置。