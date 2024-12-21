# Feed the Beast

!!! note "注意"
    需要使用[Java版本部分](../../versions/java.md)中列出的带有Hotspot的Ubuntu镜像之一。

[Feed the Beast 应用程序](https://www.feed-the-beast.com/) 的模组包通过将 `MODPACK_PLATFORM`、`MOD_PLATFORM` 或 `TYPE` 设置为 "FTBA" 来支持。

!!! note "注意"
    "FTBA" 末尾的 "A" 很重要。以前，"FTB" 是 "CURSEFORGE" 的别名。

此模组平台类型将自动处理下载和安装模组包及相应版本的Forge，因此不需要指定 `VERSION`。

### 环境变量：
- `FTB_MODPACK_ID`: **必需**，要安装的模组包的数字ID。可以通过[查找模组包](https://www.feed-the-beast.com/modpack)并在此URL部分中找到ID：

  ```
  https://www.feed-the-beast.com/modpacks/23-ftb-infinity-evolved-17
                                          ^^
  ```
- `FTB_MODPACK_VERSION_ID`: 可选，要安装的版本的数字ID。如果未指定，将安装最新版本。可以通过悬停在服务器文件条目上并抓取[此URL中的ID](../../img/ftba-version-id-popup.png)来获取“版本ID”。

- `FTB_FORCE_REINSTALL`: 如果文件变得不一致，例如意外删除它们，可以通过将此项设置为 "true" 来强制FTB重新运行。

### 升级

如果未指定特定的 `FTB_MODPACK_VERSION_ID`，只需重新启动容器即可获取最新的模组包版本。如果使用特定的版本ID，请使用新的版本ID重新创建容器。

### 示例

以下示例运行[FTB Presents Direwolf20 1.12](https://ftb.neptunepowered.org/pack/ftb-presents-direwolf20-1-12/)的最新版本：

``` shell
docker run -d --name mc-ftb -e EULA=TRUE \
  -e TYPE=FTBA -e FTB_MODPACK_ID=31 \
  -p 25565:25565 \
  itzg/minecraft-server:java8-multiarch
```

!!! note "注意"

    通常你还会为 `/data` 添加 `-v` 卷，因为模组和配置文件以及世界数据都安装在那里。