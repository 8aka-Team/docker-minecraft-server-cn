要使用不同的Minecraft版本，请传递`VERSION`环境变量（区分大小写），该变量可以具有以下值：

- LATEST（默认）
- SNAPSHOT
- 特定版本，例如“1.7.9”
- 或alpha和beta版本，例如“b1.7.3”（服务器下载可能不存在）

例如，要使用最新的快照：

```
docker run -d -e VERSION=SNAPSHOT ...
```

或特定版本：

```
docker run -d -e VERSION=1.7.9 ...
```

当使用“LATEST”或“SNAPSHOT”时，只需重新启动容器即可执行升级。在下一次启动时，如果相应发布渠道有更新的版本可用，则下载并使用新的服务器jar文件。

!!! note "注意"

    随着时间的推移，您可能会在`/data`目录中看到旧版本的服务器jar文件。删除这些文件是安全的。
