[PaperMC服务器](https://papermc.io/)可以通过将环境变量TYPE设置为“PAPER”来自动下载、升级和运行。

默认情况下，容器将找到并下载所选`VERSION`的最新构建。如果未指定`VERSION`，则选择PaperMC发布的最新Minecraft版本。除了特定的`VERSION`，还可以通过设置环境变量`PAPER_BUILD`来选择特定的Paper构建。

为了允许选择实验性构建，请将`PAPER_CHANNEL`设置为“experimental”，否则只会选择发布/默认渠道的构建。

!!! example "示例"

    ```
    docker run ... -e TYPE=PAPER ... 
    
    docker run ... -e TYPE=PAPER -e VERSION=1.20.6 ... 
    
    docker run ... -e TYPE=PAPER -e VERSION=1.20.6 -e PAPER_BUILD=140 ... 
    
    docker run ... -e TYPE=PAPER -e PAPER_CHANNEL=experimental ... 
    ```

!!! note "提示"

    如果您看到以下错误，可能意味着您需要将环境变量`PAPER_CHANNEL`设置为“experimental”
    
    ```
    No build found for version 1.21 with channel 'default'
    ```

如果您正在托管自己的Paper副本，可以使用`PAPER_DOWNLOAD_URL=<url>`覆盖下载URL。

如果您已将主机目录附加到`/data`卷，则可以通过`plugins`子目录安装插件。您还可以[附加`/plugins`卷](../../mods-and-plugins/index.md#optional-plugins-mods-and-config-attach-points)。如果您在容器运行时添加插件，则需要重新启动容器以使其生效。

[您还可以使用`SPIGET_RESOURCES`自动下载插件。](../../mods-and-plugins/spiget.md)

## 替代方案

### Pufferfish

一个[Pufferfish](https://github.com/pufferfish-gg/Pufferfish)服务器，它是“一个高度优化的Paper分支，专为需要最大性能、稳定性和“企业”功能的大型服务器设计。”

    -e TYPE=PUFFERFISH

!!! note "注意"

    `VERSION`变量用于选择分支最新、1.18或1.17。使用PUFFERFISH_BUILD来真正选择服务器版本号。

额外变量：

- `PUFFERFISH_BUILD=lastSuccessfulBuild` : 设置要使用的特定Pufferfish构建。例如：选择构建47 => 1.18.1，或构建50 => 1.18.2等
- `FORCE_REDOWNLOAD=false` : 设置为true以强制重新下载已定位的服务器jar
- `USE_FLARE_FLAGS=false` : 设置为true以添加内置[Flare](https://blog.airplane.gg/flare)分析器的适当标志

### Purpur

一个[Purpur](https://purpurmc.org/)服务器，它是“一个专为可配置性和新的、有趣的、令人兴奋的游戏玩法功能设计的Paper服务器的即插即用替代品。”

    -e TYPE=PURPUR

!!! note "注意"

    `VERSION`变量用于查找要下载的Purpur构建

额外变量:

- `PURPUR_BUILD=LATEST` : 设置要使用的特定Purpur构建
- `FORCE_REDOWNLOAD=false` : 设置为true以强制重新下载已定位的服务器jar
- `USE_FLARE_FLAGS=false` : 设置为true以添加内置[Flare](https://blog.airplane.gg/flare)分析器的适当标志
- `PURPUR_DOWNLOAD_URL=<url>` : 设置从自定义URL下载Purpur的URL。

### Folia

一个[Folia服务器](https://papermc.io/software/folia)可以通过将环境变量`TYPE`设置为“FOLIA”来使用。

默认情况下，容器将运行[Folia服务器](https://papermc.io/downloads)的最新实验性构建，但您也可以选择使用`-e FOLIABUILD=26`运行特定构建。发布渠道可以通过变量`FOLIA_CHANNEL`更改；但是，目前只有实验性构建可用。

!!! 示例

    使用`docker run`
    
    ```
    docker run -d -v /path/on/host:/data \
        -e TYPE=FOLIA \
        -p 25565:25565 -e EULA=TRUE --name mc itzg/minecraft-server
    ```

如果您正在托管自己的Folia副本，可以使用`FOLIA_DOWNLOAD_URL=<url>`覆盖下载URL。

如果您已将主机目录附加到`/data`卷，则可以通过`plugins`子目录安装插件。您还可以[附加`/plugins`卷](../../mods-and-plugins/index.md#optional-plugins-mods-and-config-attach-points)。如果您在容器运行时添加插件，则需要重新启动容器以使其生效。

[您还可以使用`SPIGET_RESOURCES`自动下载插件。](../../mods-and-plugins/spiget.md)

!!! note "注意"

    Folia类型继承自Paper类型。Paper的变量将覆盖Folia的变量。
