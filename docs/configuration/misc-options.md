# 杂项

## 使用自定义服务器 JAR 运行

如果您想运行自定义服务器 JAR，请设置 `-e TYPE=CUSTOM` 并通过 `CUSTOM_SERVER` 传递自定义服务器 JAR。它可以是 URL 或容器路径到现有的 JAR 文件。

如果是 URL，它将仅在尚未下载到 `/data` 目录时下载。因此，如果您需要升级或重新下载 JAR，则需要停止容器，从容器的 `/data` 目录中删除文件，然后重新启动。

## 强制重新下载服务器文件

对于 VANILLA、FORGE、BUKKIT、SPIGOT、PAPER、CURSEFORGE、SPONGEVANILLA 服务器类型，设置 `$FORCE_REDOWNLOAD` 为某个值(例如 'true')以强制重新下载特定服务器类型的服务器文件。通过在命令行中添加 `-e FORCE_REDOWNLOAD=true` 来实现。

例如，使用 PaperSpigot 时，它看起来像这样：

```
docker run -d -v /path/on/host:/data \
    -e TYPE=PAPER -e FORCE_REDOWNLOAD=true \
    -p 25565:25565 -e EULA=TRUE --name mc itzg/minecraft-server
```

## 以备用用户/组 ID 运行

默认情况下，容器将切换到用户 ID 1000 和组 ID 1000；但是，您可以通过在 `docker run` 命令期间设置 `UID` 和/或 `GID` 作为环境条目来覆盖这些值。

    -e UID=1234
    -e GID=1234

如果将 `--user`/`-u` 参数传递给 `docker run`，容器也会跳过用户切换。

## 额外参数

通常传递给 jar 文件的参数(写在文件名之后的那些)可以通过 `EXTRA_ARGS` 环境变量传递。

请参阅 [自定义世界目录路径](../misc/world-data.md#custom-worlds-directory-path) 示例。

## 交互式和彩色控制台

当启用 RCON 时(默认启用)，并且在容器上启用了 [TTY](https://docs.docker.com/compose/compose-file/05-services/#tty)，某些服务器类型将输出彩色日志并提供完全交互式控制台。要访问交互式控制台，请使用 [`docker attach`](https://docs.docker.com/engine/reference/commandline/container_attach/)(不是 `exec`)。完成后，确保使用 Control-P, Control-Q 序列分离而不停止容器。

如果此行为干扰了日志内容，则禁用 TTY 或完全删除设置，因为默认情况下是禁用的。在 compose 文件中，将服务的 `tty` 参数设置为 `false`。在 `docker run` 命令行中删除 `-t` 参数。

## 服务器关闭选项

为了在服务器正常关闭期间给玩家时间完成他们正在做的事情，设置 `STOP_SERVER_ANNOUNCE_DELAY` 为延迟的秒数，延迟在服务器发布广播之后。

!!! warning "增加停止延迟"

    Docker 停止延迟必须增加到比广播延迟更长的值。要使用的值将根据最终世界数据保存所需的时间而变化。如果容器以退出代码 137 退出，则表示需要更长的延迟。
    
    可以使用 [docker-compose down 的 -t 选项](https://docs.docker.com/compose/reference/down/) 增加延迟，或在 compose 文件中设置 [stop_grace_period](https://docs.docker.com/compose/compose-file/05-services/#stop_grace_period)。

## Minecraft 服务器健康监控的配置选项

图像标签包含特定变量，以简化 Minecraft 服务器健康监控的配置：

- `-e SERVER_HOST=localhost`：此变量设置要监控的 Minecraft 服务器的主机地址。默认情况下，它设置为 `localhost`，但您可以将其替换为 Minecraft 服务器的实际主机名或 IP 地址。

- `-e SERVER_PORT=25565`：此变量设置 Minecraft 服务器运行的端口号。默认情况下，Minecraft 服务器运行在端口 25565，但如果您的服务器配置为使用不同的端口，您应将 `25565` 替换为正确的端口号。这有助于监控系统在指定端口上准确检查 Minecraft 服务器的健康状态。

## OpenJ9 特定选项

openj9 构建标签包含特定变量，以简化配置：

- `-e TUNE_VIRTUALIZED=TRUE`：启用 [优化虚拟化环境](https://www.eclipse.org/openj9/docs/xtunevirtualized/) 的选项
- `-e TUNE_NURSERY_SIZES=TRUE`：配置 nursery 大小，其中初始大小为 `MAX_MEMORY` 的 50%，最大大小为 80%。

## 启用滚动日志

默认情况下，vanilla 日志文件将无限增长。可以通过使用以下命令将记录器重新配置为使用滚动日志文件策略：

```
  -e ENABLE_ROLLING_LOGS=true
```

> **注意** 这将干扰交互式/彩色控制台 [如上节所述](#interactive-and-color-console)

## 时区配置

您可以通过设置 `TZ` 环境变量来配置时区以匹配您的时区：

        -e TZ=Europe/London

例如：

        docker run -d -it -e TZ=Europe/London -p 25565:25565 --name mc itzg/minecraft-server

或者挂载 `/etc/timezone` 为只读(不支持 Windows)：

        -v /etc/timezone:/etc/timezone:ro

例如：

        docker run -d -it -v /etc/timezone:/etc/timezone:ro -p 25565:25565 --name mc itzg/minecraft-server

## HTTP 代理

您可以通过将代理的 URL 通过 `PROXY` 环境变量传递来配置使用 HTTP/HTTPS 代理。在 [示例 compose 文件](https://github.com/itzg/docker-minecraft-server/blob/master/examples/docker-compose-proxied.yml) 中，它通过设置等效的

    -e PROXY=proxy:3128

引用了伴随的 squid 代理。

## 使用 "noconsole" 选项

一些较旧版本的 Spigot(1.14 之前)需要传递 `--noconsole` 以在分离 stdin 时使用，这可以通过设置 `-e CONSOLE=FALSE` 来实现。

## 显式禁用 GUI

一些较旧的服务器会混淆并认为 GUI 界面已启用。您可以通过传递 `-e GUI=FALSE` 来显式禁用它。

## 停止持续时间

当容器收到停止信号时，Minecraft 进程包装器将尝试通过 RCON 或控制台发送 "stop" 命令，并等待进程优雅地结束。默认情况下，它等待 60 秒，但可以通过将环境变量 `STOP_DURATION` 设置为秒数来配置该持续时间。

## 仅设置

如果您使用的是主机附加的数据目录，则可以通过将 `SETUP_ONLY` 设置为 `true` 来让图像设置 Minecraft 服务器文件并在启动服务器进程之前停止。

## 启用 Flare 标志

要启用完全支持 [Flare 分析套件](https://blog.airplane.gg/flare) 所需的 JVM 标志，请设置以下变量：

    -e USE_FLARE_FLAGS=true

Flare 内置于 Pufferfish/Purpur 中，并且以 [插件形式](https://github.com/TECHNOVE/FlarePlugin) 可用于其他服务器类型。

## 启用对优化 SIMD 操作的支持

要启用对优化 SIMD 操作的支持，可以使用以下变量设置 JVM 标志：

    -e USE_SIMD_FLAGS=true

Pufferfish 和 Purpur 支持 SIMD 优化操作。

## 在初始化日志中启用时间戳

在容器启动 Minecraft 服务器之前，其输出带有 `[init]` 前缀，例如

```
[init] Starting the Minecraft server...
```

要为每个日志添加时间戳，请将 `LOG_TIMESTAMP` 设置为 "true"。日志输出将如下所示：

```
[init] 2022-02-05 16:58:33+00:00 Starting the Minecraft server...
```
