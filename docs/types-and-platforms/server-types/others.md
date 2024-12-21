# 其他

## SpongeVanilla

通过在命令行中添加 `-e TYPE=SPONGEVANILLA` 来启用 SpongeVanilla 服务器模式。

默认情况下，容器将运行最新的 `STABLE` 版本。
如果你想运行特定版本，可以在命令行中添加 `-e SPONGEVERSION=1.11.2-6.1.0-BETA-19`。

请注意，当前 [Sponge](https://www.spongepowered.org) 的 `STABLE` 版本适用于 Minecraft 1.12，需要使用 [Java 8 标签](../../versions/java.md)：

``` shell
docker run -d -v /path/on/host:/data -e TYPE=SPONGEVANILLA \
    -p 25565:25565 -e EULA=TRUE --name mc itzg/minecraft-server:java8-multiarch
```

你也可以选择使用 `EXPERIMENTAL` 分支。
只需使用 `SPONGEBRANCH` 进行更改，例如：

``` shell
$ docker run -d -v /path/on/host:/data ... \
    -e TYPE=SPONGEVANILLA -e SPONGEBRANCH=EXPERIMENTAL ...
```

## Limbo

可以通过将 `TYPE` 设置为 `LIMBO` 来运行 [Limbo](https://github.com/LOOHP/Limbo) 服务器。

配置选项及其默认值：

- `LIMBO_BUILD`=LATEST

  `VERSION` 将被忽略，因此请从 [这里](https://ci.loohpjames.com/job/Limbo/) 找到适当的值以匹配客户端期望的版本。

- `FORCE_REDOWNLOAD`=false
- `LIMBO_SCHEMA_FILENAME`=default.schem
- `LEVEL`="Default;${LIMBO_SCHEMA_NAME}"

!!! note "注意"

    与在 MOTD 中使用格式代码不同，Limbo 需要 [JSON 聊天内容](https://minecraft.wiki/w/Raw_JSON_text_format#Java_Edition)。如果提供了纯字符串（默认情况下），则会将其转换为所需的 JSON 结构。

## Crucible

可以通过将 `TYPE` 设置为 `CRUCIBLE` 来运行 [Crucible](https://github.com/CrucibleMC/Crucible) 服务器。

配置选项及其默认值：

- `CRUCIBLE_RELEASE`=latest

Crucible 仅适用于 1.7.10，因此请确保设置 `VERSION=1.7.10`。

## Custom

要使用自定义服务器 jar 或类文件，请将 `TYPE` 设置为 "CUSTOM"，并继续使用以下选项之一：

可以使用 `CUSTOM_SERVER` 设置要使用的自定义 jar，可以是下载的 URL 或容器内的文件路径。

或者，可以通过将 `CUSTOM_JAR_EXEC` 设置为 "`-cp <classpath> <classname>`" 或 "`-jar <jar file>`" 形式来替换最终的 `-jar` 调用，例如

```
-cp worldedit.jar:Carpet-Server.jar net.minecraft.server.MinecraftServer
```

!!! note "注意"

    使用 `docker run` 时，请确保将整个值用引号括起来，因为它包含空格，例如

        -e CUSTOM_JAR_EXEC="-cp worldedit.jar:Carpet-Server.jar net.minecraft.server.MinecraftServer"