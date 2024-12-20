---
title: 发送命令
---

[RCON](http://wiki.vg/RCON) 默认是启用的，因此你可以通过 `exec` 进入容器来访问 Minecraft 服务器控制台：

```
docker exec -i mc rcon-cli
```

注意：`-i` 是使用 rcon-cli 进行交互所必需的。

要运行一个简单的、一次性命令，例如停止 Minecraft 服务器，可以将命令作为参数传递给 `rcon-cli`，例如：

```
docker exec mc rcon-cli stop
```

_在这种情况下，不需要 `-i`。_

## 当 RCON 被禁用时

如果 RCON 被禁用，你可以通过将命令作为参数传递给打包的 `mc-send-to-console` 脚本来发送命令，前提是将环境变量 `CREATE_CONSOLE_IN_PIPE` 设置为 "true"。例如，可以在容器 `mc` 中将玩家设为管理员：

```shell
docker exec mc mc-send-to-console op player
            |                     |
            +- 容器名称           +- Minecraft 命令从这里开始
```

## 启用交互式控制台

为了附加并交互式地使用 Minecraft 服务器，请确保启用 TTY 并保持 stdin 打开。

!!! 示例

    使用 `docker run` 时，使用 `-it` 参数：

    ```shell
    docker run -d -it -p 25565:25565 --name mc itzg/minecraft-server
    ```

    或者在 compose 文件中：

    ```yaml
    services:
      minecraft:
        stdin_open: true
        tty: true
    ```

这样你就可以随时附加并交互使用：

    docker attach mc

然后使用 Ctrl-P Ctrl-Q 来 **退出**。

!!! info "RCON 是全交互式、彩色控制台所必需的"

    RCON 必须启用，以便使用具有自动补全和彩色日志输出的全交互式控制台。