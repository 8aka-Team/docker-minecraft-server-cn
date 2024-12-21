# 健康检查

## 健康检查

此镜像包含 [mc-monitor](https://github.com/itzg/mc-monitor)，并使用其 `status` 命令持续检查容器的健康状态。这可以从 `docker ps` 的 `STATUS` 列中观察到。

```
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                    PORTS                                 NAMES
b418af073764        mc                  "/start"            43 seconds ago      Up 41 seconds (healthy)   0.0.0.0:25565->25565/tcp, 25575/tcp   mc
```

你也可以以脚本友好的方式查询容器的健康状态：

``` shell
> docker container inspect -f "{{.State.Health.Status}}" mc
healthy
```

实际上有一个名为 `mc-health` 的包装脚本，它会负责调用 `mc-monitor status` 并传递正确的参数。如果需要自定义健康检查参数，例如在 compose 文件中，可以在服务声明中使用如下内容：

``` yaml
healthcheck:
  test: mc-health
  start_period: 1m
  interval: 5s
  retries: 20
```

一些编排系统，如 Portainer，不允许禁用此镜像声明的默认 `HEALTHCHECK`。在这些情况下，你可以通过将环境变量 `DISABLE_HEALTHCHECK` 设置为 `true` 来近似禁用健康检查。

### 旧版本的健康检查

此容器禁用了 b1.8 之前版本的健康检查，因为这些版本不支持任何类型的服务器ping操作。
更多信息请参见 [服务器列表Ping](https://wiki.vg/Server_List_Ping#Beta_1.8_to_1.3)