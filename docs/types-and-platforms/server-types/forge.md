[Forge服务器](http://www.minecraftforge.net/)可以通过将环境变量`TYPE`设置为"FORGE"来自动下载、升级和运行。

!!! example "示例"

    ```
    docker run -e TYPE=FORGE ...
    ```
    
    或在compose文件中
    ```yaml
        environment:
          TYPE: FORGE
    ```

整体版本由`VERSION`指定，[如上节所述](../../versions/minecraft.md)，并提供与新版本发布时相同的升级好处。默认情况下，将选择该Minecraft版本的推荐Forge版本。可以通过将环境变量`FORGE_VERSION`设置为"latest"来选择最新版本。您还可以通过将`FORGE_VERSION`设置为该版本，例如"14.23.5.2854"，来选择特定的Forge版本。

!!! example "示例"

    ```
    docker run -e TYPE=FORGE -e VERSION=1.12.2 -e FORGE_VERSION=14.23.5.2854 ...
    ```
    
    或在compose文件中
    ```yaml
        environment:
          TYPE: FORGE
          VERSION: "1.12.2"
          FORGE_VERSION: "14.23.5.2854"
    ```

要使用预下载的Forge安装程序，请将其放置在挂载到容器的位置，并使用`FORGE_INSTALLER`指定容器路径。要从自定义位置（例如您自己的文件仓库）下载Forge安装程序，请使用`FORGE_INSTALLER_URL`指定URL。

在上述两种情况下，都不需要`VERSION`或`FORGE_VERSION`变量。

!!! note "注意"

    如果在安装Forge时发生错误，可能可以通过将`FORGE_FORCE_REINSTALL`临时设置为"true"来解决。请确保在成功启动服务器后删除该变量。

## 替代方案

### NeoForge

还提供了对[NeoForge](https://neoforged.net/)的支持。可以通过将`TYPE`设置为"NEOFORGE"来自动管理NeoForge服务器。`VERSION`指定Minecraft版本，`NEOFORGE_VERSION`可以设置为选择特定版本、"latest"或"beta"。默认情况下，将使用请求的Minecraft版本的最新非beta NeoForge版本。

!!! 示例

    ```
    docker run -e TYPE=NEOFORGE -e VERSION=1.20.1 -e NEOFORGE_VERSION=47.1.79 ...
    ```
    
    或在compose文件中
    ```yaml
        environment:
          TYPE: NEOFORGE
          VERSION: "1.20.4"
          NEOFORGE_VERSION: "beta"
    ```
