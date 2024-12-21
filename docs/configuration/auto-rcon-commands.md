
# 自动执行RCON命令

RCON命令可以在服务器启动、客户端连接或客户端断开时配置为自动执行。

!!! note "注意"

    在compose文件环境变量中声明多个命令时，使用YAML的`|-`[块样式指示符](https://yaml-multiline.info/)最为简便。

**服务器启动时：**

``` yaml
      RCON_CMDS_STARTUP:  |-
        gamerule doFireTick false
        pregen start 200
```

**客户端连接时：**

``` yaml
      RCON_CMDS_ON_CONNECT:  |-
        team join New @a[team=]
```

**注意：**
* 在客户端连接时，我们只知道有连接发生，但不知道是谁连接的。需要使用RCON命令来处理。

**客户端断开时：**

``` yaml
      RCON_CMDS_ON_DISCONNECT:  |-
        gamerule doFireTick true
```

**第一个客户端连接时：**

``` yaml
      RCON_CMDS_FIRST_CONNECT: |-
        pregen stop
```

**最后一个客户端断开时：**

``` yaml
      RCON_CMDS_LAST_DISCONNECT: |-
        kill @e[type=minecraft:boat]
        pregen start 200
```

**新玩家规则示例**

使用团队NEW和团队OLD来跟踪服务器上的玩家。因此，将没有团队的玩家移动到NEW，执行命令，然后将他们移动到团队OLD。
[参考文章](https://www.minecraftforum.net/forums/minecraft-java-edition/redstone-discussion-and/2213523-detect-players-first-join)

``` yaml
      RCON_CMDS_STARTUP:  |-
        /pregen start 200
        /gamerule doFireTick false
        /team add New
        /team add Old
      RCON_CMDS_ON_CONNECT: |-
        /team join New @a[team=]
        /give @a[team=New] birch_boat
        /team join Old @a[team=New]
      RCON_CMDS_FIRST_CONNECT: |-
        /pregen stop
      RCON_CMDS_LAST_DISCONNECT: |-
        /kill @e[type=minecraft:boat]
        /pregen start 200
```
