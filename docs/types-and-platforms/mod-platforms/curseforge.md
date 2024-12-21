# 手动CurseForge服务器包

!!! warning "已弃用"

    此模组平台类型已弃用。请在新部署中使用[AUTO_CURSEFORGE](auto-curseforge.md)。

通过将`MODPACK_PLATFORM`、`MOD_PLATFORM`或`TYPE`设置为"CURSEFORGE"以及以下特定变量来启用此服务器模式。

您需要使用`CF_SERVER_MOD`环境变量指定要运行的模组包。CurseForge服务器模组包与其相应的客户端模组包一起可在<https://www.curseforge.com/minecraft/modpacks>获取。

现在您可以在命令行中添加`-e CF_SERVER_MOD=name_of_modpack.zip`。

    docker run -d -v /path/on/host:/data -e TYPE=CURSEFORGE \
        -e CF_SERVER_MOD=SkyFactory_4_Server_4.1.0.zip \
        -p 25565:25565 -e EULA=TRUE --name mc itzg/minecraft-server

如果您希望将预下载的模组包与数据目录分开，则可以在您选择的路径上附加另一个卷并引用该路径。以下示例使用`/modpacks`作为容器路径作为预下载区域：

    docker run -d -v /path/on/host:/data -v /path/to/modpacks:/modpacks \
        -e TYPE=CURSEFORGE \
        -e CF_SERVER_MOD=/modpacks/SkyFactory_4_Server_4.1.0.zip \
        -p 25565:25565 -e EULA=TRUE --name mc itzg/minecraft-server

### 模组包数据目录

默认情况下，CurseForge模组包会扩展到子目录`/data/FeedTheBeast`并在那里执行。（默认位置是出于历史原因选择的，当时Curse和FTB是共同维护的。）

可以通过设置`CF_BASE_DIR`来更改目录，例如`-e CF_BASE_DIR=/data`。

### 有问题的启动脚本

一些模组包的启动脚本有缺陷或过于复杂。您可以通过添加`-e USE_MODPACK_START_SCRIPT=false`来避免使用捆绑的启动脚本，并使用此镜像的标准服务器启动逻辑。

### 修复“无法启动forgemodloader”

如果您的服务器模组包加载失败并出现类似[此错误](https://support.feed-the-beast.com/t/cant-start-crashlanding-server-unable-to-launch-forgemodloader/6028/2)：

    unable to launch forgemodloader

那么您可以通过在运行调用中添加以下内容来应用解决方法：

    -e FTB_LEGACYJAVAFIXER=true