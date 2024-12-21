# 从Modrinth自动下载

[Modrinth](https://modrinth.com/) 是一个开源的模组平台，拥有一个简洁易用的网站，用于查找 [Fabric, Forge等模组](https://modrinth.com/mods)、[Paper等插件](https://modrinth.com/plugins) 和 [数据包](https://modrinth.com/datapacks)。在启动时，容器会自动定位并下载与使用的 `TYPE` 和 `VERSION` 相对应的最新版本的模组/插件文件。之前下载的旧文件版本将自动清理。

- **MODRINTH_PROJECTS** : 项目短名称(slug)或ID的逗号或换行分隔列表。项目ID位于“技术信息”部分。项目短名称是URL中 `/mod/`、`/plugin/` 或 `/datapack/` 之后的那部分。例如：
  ```
    https://modrinth.com/mod/fabric-api
                             ----------
                              |
                              +-- 项目短名称
  ```
  此外，可以通过在项目短名称后添加冒号和版本ID、版本号/名称或发布类型来声明特定版本(或发布类型)。版本ID或编号可以在“元数据”部分找到。有效的发布类型为 `release`、`beta`、`alpha`。
  
  要从Modrinth项目中选择数据包，请在条目前加上 "datapack:"。在运行原版服务器时，这是可选的，因为原版服务器只能选择数据包。
        
  | 描述                     | 示例项目条目     |
  |--------------------------|------------------|
  | 选择最新版本             | `fabric-api`     |
  | 选择特定版本             | `fabric-api:PbVeub96` |
  | 选择最新beta版本         | `fabric-api:beta` |
  | 使用项目ID选择最新版本   | `P7dR8mSH`       |
  | 选择数据包的最新版本     | `datapack:terralith` |
  | 选择数据包的特定版本     | `datapack:terralith:2.5.5` |

## 额外选项

`MODRINTH_DOWNLOAD_DEPENDENCIES`
: 可以设置为 `none`(默认)、`required` 或 `optional` 来下载必需和/或可选的依赖项。

`MODRINTH_ALLOWED_VERSION_TYPE`
: 版本类型用于确定从每个项目中使用的最新版本。允许的值为 `release`(默认)、`beta`、`alpha`。设置为 `beta` 将选择发布和beta版本。设置为 `alpha` 将选择发布、beta和alpha版本。
