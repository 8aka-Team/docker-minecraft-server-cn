# 自动停止

为特定应用(例如在AWS Fargate上节省计费)添加了一个选项，可以在指定时间后停止服务器。该功能与自动暂停功能不兼容，因为它们基本上会相互抵消。

!!! note "注意"

    Docker容器变量必须相应设置(重启策略设置为“no”)，并且容器必须手动重启。

可以在`/data`目录中创建一个`.skip-stop`文件，使服务器跳过自动停止，只要该文件存在。自动停止计时器也将重置。

在[examples/docker-compose-autostop.yml](https://github.com/itzg/docker-minecraft-server/blob/master/examples/docker-compose-autostop.yml)中提供了一个示例的compose文件。

通过设置以下内容启用自动停止功能：

```
-e ENABLE_AUTOSTOP=TRUE
```

以下环境变量定义了自动停止的行为：
* `AUTOSTOP_TIMEOUT_EST`，默认`3600`(秒)
  描述最后一个客户端断开连接与服务器停止之间的时间(读作已建立的超时)
* `AUTOSTOP_TIMEOUT_INIT`，默认`1800`(秒)
  描述服务器启动与服务器停止之间的时间，当在此期间没有客户端连接时(读作初始化的超时)
* `AUTOSTOP_PERIOD`，默认`10`(秒)
  描述处理服务器停止的守护进程状态机的周期

> 要进行故障排除，请添加`DEBUG_AUTOSTOP=true`以查看额外输出

## 代理支持

如果您使用PROXY协议，例如通过HAProxy或Fly.io，您需要在服务器的各种配置中启用它，然后将`USES_PROXY_PROTOCOL`环境变量设置为`true`。这使得自动停止可以监控服务器，否则它无法监控。
