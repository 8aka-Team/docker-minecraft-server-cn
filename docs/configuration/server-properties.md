# 服务器配置

为了统一管理Minecraft服务器容器的配置，所有[`server.properties`](https://minecraft.wiki/w/Server.properties)条目都可以通过以下部分描述的环境变量进行管理。其中一些映射提供了超出属性文件的额外功能。

如果你更喜欢手动管理`server.properties`文件，可以将`OVERRIDE_SERVER_PROPERTIES`设置为"false"。同样，你可以通过将`SKIP_SERVER_PROPERTIES`设置为"true"来完全跳过启动脚本创建`server.properties`。

!!! note "注意"

    要清除服务器属性，请将变量设置为空字符串，例如`-e RESOURCE_PACK=""`。未设置的变量将被忽略，现有的服务器属性将保持不变。

要查看服务器将使用的`server.properties`内容，请将环境变量`DUMP_SERVER_PROPERTIES`设置为"true"，服务器启动前将输出`server.properties`的内容。

## 占位符

在通过容器环境变量声明服务器属性时，这些值可能包含在更新`server.properties`文件时处理的占位符。

占位符的语法是DOS风格的`%VAR%`，以避免被Docker或shell处理，以下选项可用：

`%VAR%` 或 `%env:VAR%`

: 替换为解析后的值或环境变量`VAR`的值

`%date:FMT%`

: 使用给定的`FMT`字符串格式化当前日期/时间，由[Java的DateTimeFormatter](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/format/DateTimeFormatter.html)处理。

可以引用任何声明或解析的环境变量，例如`VERSION`和`TYPE`。此外，[Modrinth](../types-and-platforms/mod-platforms/modrinth-modpacks.md)和[Auto CurseForge](../types-and-platforms/mod-platforms/auto-curseforge.md)模组包将公开环境变量`MODPACK_NAME`和`MODPACK_VERSION`。原始声明的版本，例如"LATEST"或"SNAPSHOT"，可在变量`DECLARED_VERSION`中获得。

!!! 示例

    作为compose文件环境条目：

    ```yaml
        MOTD: Running %MODPACK_NAME% version %env:MODPACK_VERSION%
        LEVEL: world-%date:yyyy-MM-dd%
    ```

!!! warning "警告"

    手动管理`server.properties`时不支持占位符

## 属性

### 服务器消息

在客户端UI中，显示在每个服务器条目下方的服务器消息可以通过`MOTD`环境变量更改，或者默认根据服务器类型和版本计算，例如

    A Paper Minecraft Server powered by Docker

这样你可以轻松区分你可能启动的几个服务器类型。

段落符号(§)和其他Unicode字符会自动转换，以允许[格式化代码](https://minecraft.wiki/w/Formatting_codes)在所有服务器版本中一致使用。对于Minecraft版本小于1.20，`server.properties`中的Unicode字符默认会转义为`\uXXXX`。可以通过将`SERVER_PROPERTIES_ESCAPE_UNICODE`设置为"true"或"false"来更改此行为。

!!! 示例

    使用`docker run`

         -e MOTD="A §l§cMinecraft§r §nserver"

    或在compose文件中

        environment:
          MOTD: "A §l§cMinecraft§r §nserver"

    渲染效果

    ![](../img/motd-example.png)

要生成多行MOTD，请在字符串中嵌入换行符`\n`，例如以下示例。

!!! 示例 "多行MOTD"

    使用`docker run`

    ```
    -e MOTD="Line one\nLine two"
    ```

    或在compose文件中

    ```yaml
          MOTD: |
            line one
            line two
    # 或
    #      MOTD: "line one\nline two"
    ```

!!! tip "提示"

    你还可以使用[占位符](#placeholders)嵌入配置和解析的环境变量。

### 难度

难度世界(默认：`easy`)可以这样设置：

```
docker run -d -e DIFFICULTY=hard ...
```

有效值为：`peaceful`、`easy`、`normal`和`hard`，如果不是这些值之一，日志中将输出错误消息。

参考[NitWikit](https://nitwikit.8aka.org/Java/start/config-server#%E8%AE%BE%E7%BD%AE%E9%9A%BE%E5%BA%A6)

### 白名单玩家

!!! warning "对于公共服务器"

    考虑设置预期玩家的白名单非常重要。

要为你的Minecraft服务器设置白名单玩家，你可以：

- 通过`WHITELIST`环境变量提供以逗号或换行符分隔的用户名和/或UUID列表
- 通过`WHITELIST_FILE`提供白名单文件的URL或容器路径，该文件将被检索/复制到标准位置

!!! 示例

    在compose文件中，可以使用文本块来提高可维护性，例如

    ```yaml
          WHITELIST: |
            user1
            user2
            user3
    ```

当设置其中之一时，将启用[连接用户的白名单](https://minecraft.wiki/w/Server.properties#white-list)。

要更改白名单文件已存在时的行为，请将变量`EXISTING_WHITELIST_FILE`设置为以下选项之一：

`SKIP`
: 当白名单文件已存在时跳过处理。这与将旧版变量`OVERRIDE_WHITELIST`设置为"false"相同。

`SYNCHRONIZE`
: 将文件中的用户列表与提供的`WHITELIST`或`WHITELIST_FILE`同步。当两者都使用时，`WHITELIST`将优先。这与将旧版变量`OVERRIDE_WHITELIST`设置为"true"相同。

`MERGE`
: 将`WHITELIST`中的用户列表合并到现有文件中。不能与`WHITELIST_FILE`一起使用此选项。

`SYNC_FILE_MERGE_LIST`(默认)
: 当提供`WHITELIST_FILE`时，它将覆盖现有的白名单文件。此外，如果提供了`WHITELIST`，则这些用户将合并到新复制的文件中。

!!! note "注意"

    对于1.7.3之前的版本，将维护`white-list.txt`。这些版本仅支持用户名。

要[立即强制执行白名单更改](https://minecraft.wiki/w/Server.properties#enforce-whitelist)，当使用白名单命令时，将`ENFORCE_WHITELIST`设置为"true"。如果手动管理白名单文件，可以将`ENABLE_WHITELIST`设置为"true"以设置`white-list`属性。

!!! tip "更改用户API提供者"

    用于白名单和操作处理的提供的用户名通过[PlayerDB](https://playerdb.co/)或[Mojang的API](https://wiki.vg/Mojang_API#Username_to_UUID)解析。默认使用PlayerDB，但可以通过将环境变量`USER_API_PROVIDER`设置为"mojang"来更改。有时一个或另一个服务可能会过载，这就是为什么可以切换提供者的原因。

### 操作员/管理员玩家

与白名单类似，可以通过以下方式将用户配置为Minecraft服务器的操作员(即管理员)：

- 通过`OPS`环境变量提供以逗号或换行符分隔的用户名和/或UUID列表
- 通过`OPS_FILE`提供操作文件的URL或容器路径，该文件将被检索/复制到标准位置

!!! 示例

    在compose文件中，可以使用文本块来提高可维护性，例如

    ```yaml
          OPS: |
            user1
            user2
            user3
    ```

要更改操作文件已存在时的行为，请将变量`EXISTING_OPS_FILE`设置为以下选项之一：

`SKIP`
: 当操作文件已存在时，跳过处理该文件。这与将旧版变量`OVERRIDE_OPS`设置为"false"相同。

`SYNCHRONIZE`
: 将文件中的用户列表与提供的`OPS`或`OPS_FILE`同步。当两者都使用时，`OPS`将优先。`level`和`bypassesPlayerLimit`将从之前的条目中保留。这与将旧版变量`OVERRIDE_OPS`设置为"true"相同。

`MERGE`
: 将`OPS`中的用户列表合并到现有文件中。此选项不能与`OPS_FILE`一起使用。

`SYNC_FILE_MERGE_LIST` (默认)
: 当提供`OPS_FILE`时，它将覆盖现有的操作文件。此外，如果提供了`OPS`，则这些用户将被合并到新复制的文件中。

!!! note "注意"

    对于1.7.3之前的版本，将维护`ops.txt`。这些版本仅支持用户名。

### 启用/禁用数据包的初始选择

在[22W42A](https://www.minecraft.net/en-us/article/minecraft-snapshot-22w42a)中新增，可以通过将这些设置为逗号分隔的数据包列表，在初始世界创建之前控制带有功能标志的数据包：

- `INITIAL_ENABLED_PACKS`
  例如 "update_1_20,bundle"
- `INITIAL_DISABLED_PACKS`

### 服务器图标

可以使用`ICON`变量配置服务器图标。图像将自动下载、缩放并从任何其他图像格式转换：

    docker run -d -e ICON=http://..../some/image.png ...

默认情况下，已设置的服务器图标不会被覆盖。可以通过将`OVERRIDE_ICON`设置为`TRUE`来更改和覆盖它。

    docker run -d -e ICON=http://..../some/other/image.png -e OVERRIDE_ICON=TRUE...

### RCON

RCON默认**启用**，以允许优雅地关闭服务器并在备份期间协调保存状态。可以通过将`ENABLE_RCON`设置为"false"来禁用RCON。

!!! warning "警告"

    禁用RCON将删除并限制一些功能，例如交互式和彩色控制台支持。

默认密码在每次启动时随机生成；但是，可以使用`RCON_PASSWORD`设置特定密码。

**除非您了解所有后果并使用`RCON_PASSWORD`设置了**安全密码**，否则请勿将RCON端口映射到外部**。

!!! info "信息"

    映射端口(`-p` 命令行或 `ports` 在 compose 中)到容器外部和 Docker 网络需要是有目的的选择。大多数生产环境的 Docker 部署不需要将任何 Minecraft 端口从服务器本身映射到外部。

默认情况下，服务器在容器内监听 RCON 的端口是 25575。可以通过 `RCON_PORT` 进行更改，但只有在有充分理由的情况下才这样做。**不要通过 `server.properties` 更改 `rcon.port`**，否则集成将会中断。

### 查询

启用此功能将启用 gamespy 查询协议。
默认情况下，查询端口将是 `25565`(UDP)，但可以通过 `QUERY_PORT` 变量轻松更改。

    docker run -d -e ENABLE_QUERY=true

### 最大玩家数

默认的最大玩家数是 20，可以通过 `MAX_PLAYERS` 变量增加。

    docker run -d -e MAX_PLAYERS=50

### 最大世界大小

这设置了世界边界可以达到的最大可能大小，以区块的半径表示。

    docker run -d -e MAX_WORLD_SIZE=10000

### 允许下界

允许玩家前往下界。

    docker run -d -e ALLOW_NETHER=true

### 公告玩家成就

允许服务器在玩家获得成就时进行公告。

    docker run -d -e ANNOUNCE_PLAYER_ACHIEVEMENTS=true

### 启用命令方块

启用命令方块。

     docker run -d -e ENABLE_COMMAND_BLOCK=true

### 强制游戏模式

强制玩家以默认游戏模式加入。

- false - 玩家将以他们离开时的游戏模式加入。
- true - 玩家将始终以默认游戏模式加入。

  `docker run -d -e FORCE_GAMEMODE=false`

### 生成结构

定义是否在新区块中生成结构(如村庄)。

- false - 新区块中不会生成结构。
- true - 新区块中会生成结构。

  `docker run -d -e GENERATE_STRUCTURES=true`

### 极限模式

如果设置为 true，玩家死亡后将被设置为旁观者模式。

    docker run -d -e HARDCORE=false

### 数据收集器

如果设置为 false，服务器将不会向 snoop.minecraft.net 服务器发送数据。

    docker run -d -e SNOOPER_ENABLED=false

### 最大建筑高度

允许建筑的最大高度。
地形仍可能自然生成在较低高度限制之上。

    docker run -d -e MAX_BUILD_HEIGHT=256

### 最大 tick 时间

单个 tick 可能花费的最大毫秒数，超过此时间服务器看门狗将停止服务器并显示消息：“A single server tick took 60.00 seconds (should be max 0.05); Considering it to be crashed, server will forcibly shutdown.” 一旦满足此条件，它将调用 System.exit(1)。
设置为 -1 将完全禁用看门狗。

    docker run -d -e MAX_TICK_TIME=60000

### 生成动物

确定动物是否能够生成。

    docker run -d -e SPAWN_ANIMALS=true

### 生成怪物

确定怪物是否会被生成。

    docker run -d -e SPAWN_MONSTERS=true

### 生成 NPC

确定村民是否会被生成。

    docker run -d -e SPAWN_NPCS=true

### 设置出生点保护

设置非 OP 玩家不能编辑的区域(0 表示禁用)。

    docker run -d -e SPAWN_PROTECTION=0

### 视距

设置服务器发送给客户端的世界数据量，以玩家周围每个方向的区块数(半径，非直径)表示。
它决定了服务器端的视距。

    docker run -d -e VIEW_DISTANCE=10

### 种子世界

如果你想用特定的种子创建Minecraft世界，使用`SEED`，例如：

    -e SEED=1785852800490497919

如果使用负值作为种子，确保用引号括起该值，例如：

    -e SEED="-1785852800490497919"

### 游戏模式

默认情况下，Minecraft服务器配置为生存模式。你可以使用`MODE`更改模式，你可以提供[标准数值](http://minecraft.wiki/Game_mode#Game_modes)或快捷值：

- 创造
- 生存
- 冒险
- 旁观者(仅适用于Minecraft 1.8或更高版本)

例如：

    docker run -d -e MODE=创造 ...

### PVP模式

默认情况下，服务器创建时启用了玩家对玩家(PVP)模式。你可以通过将环境变量`PVP`设置为`false`来禁用此功能，例如：

    docker run -d -e PVP=false ...

### 世界类型和生成器设置

默认情况下，生成一个包含山丘、山谷、水等的标准世界。可以通过将`LEVEL_TYPE`设置为[此处列出的预期类型](https://minecraft.wiki/w/Server.properties#level-type)来配置不同的世界类型。

对于某些世界类型，可以使用`GENERATOR_SETTINGS`进一步自定义世界生成。

要配置`GENERATOR_SETTINGS`，你需要添加适当的`GeneratorOptions` JSON配置。对于超平坦世界，你可以省略`flat_world_options`。

层从-64开始应用，并按列表顺序添加。

超平坦世界示例：

- 1x 基岩
- 2x 石头
- 15x 砂岩
- 沙漠生物群系

```yaml
LEVEL_TYPE: FLAT
GENERATOR_SETTINGS: >-4
    {
        "layers": [
            {
                "block": "minecraft:bedrock",
                "height": 1
            },
            {
                "block": "minecraft:stone",
                "height": 2
            },
            {
                "block": "minecraft:sandstone",
                "height": 15
            }
        ],
        "biome": "minecraft:desert"
    }
```

更多详情，请查看[官方维基](https://minecraft.wiki/w/Java_Edition_level_format#generatorOptions_tag_format)。

### 自定义服务器资源包

你可以设置指向自定义资源包的链接，并使用`RESOURCE_PACK`和`RESOURCE_PACK_SHA1`选项分别设置其校验和，默认值为空白：

    docker run -d -e 'RESOURCE_PACK=http://link.com/to/pack.zip?=1' -e 'RESOURCE_PACK_SHA1=d5db29cd03a2ed055086cef9c31c252b4587d6d0'

你可以通过将`RESOURCE_PACK_ENFORCE`设置为`TRUE`(默认：`FALSE`)来强制客户端使用资源包。

### 世界保存名称

你可以通过使用`LEVEL`选项在不同的世界保存之间切换，或者运行具有不同保存的多个容器，默认值为“world”：

    docker run -d -e LEVEL=bonus ...

> **注意：** 如果运行多个容器，请确保为每个使用的`LEVEL`指定不同的`-v`主机目录，或者不使用`-v`，容器的文件系统将保持封装。

> **信息：** 参考[数据目录](../data-directory.md)部分，了解`$LEVEL`目录的位置描述。

### 在线模式

默认情况下，服务器会检查连接的玩家是否在Minecraft的账户数据库中。如果你想创建一个离线服务器或你的服务器未连接到互联网，你可以通过环境变量`ONLINE_MODE`禁用服务器尝试连接到minecraft.net以验证玩家，例如：

    docker run -d -e ONLINE_MODE=FALSE ...

### 允许飞行

允许用户在生存模式下使用飞行功能，前提是他们安装了提供飞行功能的模组。

    -e ALLOW_FLIGHT=TRUE|FALSE

### 服务器名称

服务器名称(例如用于bungeecord)可以这样设置：

    docker run -d -e SERVER_NAME=MyServer ...

### 服务器端口

> **警告：** 仅当你知道自己在做什么时才更改此值。仅在使用主机网络时才需要，而主机网络很少使用。请改用`-p`端口映射。

如果你必须，服务器端口可以这样设置：

    docker run -d -e SERVER_PORT=25566 ...

**然而**，请确保相应更改端口映射，并准备好一些功能可能会中断。

### 自定义服务器属性

一些模组/插件使用自定义的`server.properties`条目，可以通过`CUSTOM_SERVER_PROPERTIES`环境变量声明。内容必须是换行符分隔的`name=value`对。

在compose文件中，换行符分隔的条目可以这样声明：

```yaml
      CUSTOM_SERVER_PROPERTIES: |
        custom1=value1
        defaultworldgenerator-port=f8c04631-f744-11ec-b260-f02f74b094e0
```

当从bash shell使用`docker run`时，条目必须用`$'`语法引用，例如：

```
-e CUSTOM_SERVER_PROPERTIES=$'k1=v1\nk2=v2'
```

### 其他服务器属性映射

| 环境变量                              | 服务器属性                             |
|-----------------------------------|-----------------------------------|
| BROADCAST_CONSOLE_TO_OPS          | broadcast-console-to-ops          |
| BROADCAST_RCON_TO_OPS             | broadcast-rcon-to-ops             |
| ENABLE_STATUS                     | enable-status                     |
| ENFORCE_SECURE_PROFILE            | enforce-secure-profile            |
| ENTITY_BROADCAST_RANGE_PERCENTAGE | entity-broadcast-range-percentage |
| FUNCTION_PERMISSION_LEVEL         | function-permission-level         |
| NETWORK_COMPRESSION_THRESHOLD     | network-compression-threshold     |
| OP_PERMISSION_LEVEL               | op-permission-level               |
| PLAYER_IDLE_TIMEOUT               | player-idle-timeout               |
| PREVENT_PROXY_CONNECTIONS         | prevent-proxy-connections         |
| SIMULATION_DISTANCE               | simulation-distance               |
| SYNC_CHUNK_WRITES                 | sync-chunk-writes                 |
| USE_NATIVE_TRANSPORT              | use-native-transport              |
| HIDE_ONLINE_PLAYERS               | hide-online-players               |
| RESOURCE_PACK_ID                  | resource-pack-id                  |
| RESOURCE_PACK_PROMPT              | resource-pack-prompt              |
| MAX_CHAINED_NEIGHBOR_UPDATES      | max-chained-neighbor-updates      |
| LOG_IPS                           | log-ips                           |
| REGION_FILE_COMPRESSION           | region-file-compression           |   
| BUG_REPORT_LINK                   | bug-report-link                   |
| PAUSE_WHEN_EMPTY_SECONDS          | pause-when-empty-seconds          |