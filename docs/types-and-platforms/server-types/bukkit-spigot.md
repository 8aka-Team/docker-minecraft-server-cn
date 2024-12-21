# Bukkit/Spigot

通过将环境变量 `TYPE` 设置为 "BUKKIT" 或 "SPIGOT" 来运行 Bukkit/Spigot 服务器类型。

!!! example "示例"

    命令行
    ```
    docker run ... -e TYPE=SPIGOT ...
    ```
    
    编写
    ```yaml
        environment:
          ...
          TYPE: SPIGOT
    ```

如果下载的服务器 jar 文件损坏，请将 `FORCE_REDOWNLOAD` 设置为 "true"，以在下次容器启动时强制重新下载。成功重新下载后，您应将其删除或设置为 "false"。

如果您托管自己的 Bukkit/Spigot 副本，可以通过以下方式覆盖下载 URL：

- -e BUKKIT_DOWNLOAD_URL=<url>
- -e SPIGOT_DOWNLOAD_URL=<url>

!!! note "注意"

    某些 `VERSION` 值并不像您想象的那么直观，因此请确保点击版本条目以找到下载所需的**确切**版本。例如，"1.8" 是不够的，因为它们的下载命名期望 `1.8-R0.1-SNAPSHOT-latest` 完全匹配。

## 从源代码构建

您可以通过将环境变量 `BUILD_FROM_SOURCE` 设置为 "true" 来从源代码构建 Spigot。

## 替代方案

### Canyon

[Canyon](https://github.com/canyonmodded/canyon) 是 Minecraft Beta 1.7.3 的 CraftBukkit 分支。它在保留与旧 Bukkit 插件和模组兼容性的同时，包含多个增强功能。

    -e VERSION=b1.7.3 -e TYPE=CANYON

!!! important "重要"
    仅支持 `VERSION=b1.7.3`。由于该版本早于该镜像使用的健康检查机制，因此需要通过设置 `DISABLE_HEALTHCHECK=true` 来禁用健康检查。

Canyon 目前处于临时暂停状态，因此默认情况下将使用 GitHub 上的最终构建；但是，在某些情况下可以通过设置 `CANYON_BUILD` 来选择特定的构建编号，例如

    -e CANYON_BUILD=6
    -e CANYON_BUILD=26
