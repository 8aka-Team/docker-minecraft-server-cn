# 自动暂停

提供了一个自动暂停功能，用于监控客户端是否连接到服务器。如果在指定时间内没有客户端连接，Java进程将进入暂停状态。当客户端在进程暂停时尝试连接，进程将恢复到运行状态。客户端的体验不会改变。可以通过将环境变量`ENABLE_AUTOPAUSE`设置为"true"来启用此功能。

!!! important  "重要"

    **您必须大大增加或禁用max-tick-time看门狗功能。** 从服务器的角度来看，暂停会导致单个tick的持续时间与进程停止的时间一样长，因此服务器看门狗可能会在进程继续后介入，可能会强制容器重启。为防止这种情况，请确保在`server.properties`文件中将`max-tick-time`设置为非常大的值或-1以完全禁用它，这是强烈推荐的。可以在[下面的部分](../../configuration/server-properties.md#max-tick-time)中描述的`MAX_TICK_TIME`进行设置。

    非原版版本可能有自己的配置文件，您可能需要单独禁用它们的看门狗。对于PaperMC服务器，您需要发送JVM标志`-Ddisable.watchdog=true`，这可以通过docker环境变量`-e JVM_DD_OPTS=disable.watchdog:true`来完成。

    在启动时，会检查`server.properties`文件，如果适用，会在终端打印警告。当服务器创建时(持久目录中没有数据)，属性文件会创建并禁用看门狗。

用于唤醒服务器的工具(`knock(d)`)在网络接口级别工作。因此，在使用非默认网络环境(例如主机网络、Portainer或NAS解决方案)时，必须使用`AUTOPAUSE_KNOCK_INTERFACE`变量设置正确的接口。请参阅下面变量的描述。

当服务器暂停时，会在`/data`目录中创建一个名为`.paused`的文件，并在服务器恢复时删除。其他服务可以在唤醒服务器之前检查此文件的存在。

可以在`/data`目录中创建一个`.skip-pause`文件，使服务器在文件存在期间跳过自动暂停。自动暂停计时器也会重置。

在[示例](https://github.com/itzg/docker-minecraft-server/blob/master/examples/autopause/compose.yml)中提供了一个启动示例compose文件。

自动暂停与`EXEC_DIRECTLY=true`不兼容，两者不能同时设置。

!!! note "注意"

    在配置启用自动暂停的kubernetes readiness/liveness健康检查时，请确保引用`mc-health`包装脚本而不是直接引用`mc-status`。

## 附加配置

以下环境变量定义了自动暂停的行为：

- `AUTOPAUSE_TIMEOUT_EST`，默认`3600`(秒)
  描述最后一个客户端断开连接与进程暂停之间的时间(读作timeout established)
- `AUTOPAUSE_TIMEOUT_INIT`，默认`600`(秒)
  描述服务器启动与进程暂停之间的时间，当在此期间没有客户端连接时(读作timeout initialized)
- `AUTOPAUSE_TIMEOUT_KN`，默认`120`(秒)
  描述端口敲击(例如主菜单ping)与进程暂停之间的时间，当在此期间没有客户端连接时(读作timeout knocked)
- `AUTOPAUSE_PERIOD`，默认`10`(秒)
  描述处理进程暂停的守护进程状态机的周期(恢复是独立完成的)
- `AUTOPAUSE_KNOCK_INTERFACE`，默认`eth0`
  <br>描述传递给`knockd`守护进程的接口。如果默认接口不起作用，请在容器内运行`ifconfig`命令，并从其输出中推导出接收传入连接的接口。传递的接口必须在容器内存在。使用回环接口(`lo`)可能不会产生预期结果。

!!! tip "提示"

    要进行故障排除，请添加`DEBUG_AUTOPAUSE=true`以查看额外输出

## 无Root自动暂停

如果您以无Root方式运行容器，则需要向容器添加`CAP_NET_RAW`功能，例如使用compose文件中的[`cap_add`服务字段](https://docs.docker.com/compose/compose-file/05-services/#cap_add)或[`--cap-add` docker run参数](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities)。可能还需要将环境变量`SKIP_SUDO`设置为"true"。

您可能需要将默认端口转发器从RootlessKit更改为slirp4netns。

对于Docker，请参阅以下设置：

- https://docs.docker.com/engine/security/rootless/#networking-errors
- https://rootlesscontaine.rs/getting-started/docker/#changing-the-port-forwarder

对于Podman，请参阅以下设置：
- https://rootlesscontaine.rs/getting-started/podman/#changing-the-port-forwarder


!!! 示例 "使用docker run"

    -e AUTOPAUSE_KNOCK_INTERFACE=tap0 --cap-add=CAP_NET_RAW --network slirp4netns:port_handler=slirp4netns

