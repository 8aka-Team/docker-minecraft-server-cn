# 使用模组和插件

## 模组包平台

到目前为止，使用模组和插件(尤其是大量模组和插件)最简单的方法是利用模组包，并使用[支持的模组包平台](../types-and-platforms/index.md)之一。

以下是一些支持的模组包平台：

- [Modrinth](../types-and-platforms/mod-platforms/modrinth-modpacks.md) 
- [CurseForge](../types-and-platforms/mod-platforms/auto-curseforge.md)
- [Feed the Beast](../types-and-platforms/mod-platforms/ftb.md)

## 下载自动化

在左侧，有一些部分描述了一些下载自动化选项。

## 模组与插件

“模组”和“插件”这两个术语可能会让人感到困惑。一般来说，经验法则是“模组”用于在客户端运行的类型，以修改渲染、添加新方块和添加服务器行为，例如[Forge](../types-and-platforms/server-types/forge.md)和[Fabric](../types-and-platforms/server-types/fabric.md)。“插件”用于**仅在服务器上运行**的类型，以添加行为、命令等，例如[Paper](../types-and-platforms/server-types/paper.md)(源自[Bukkit/Spigot](../types-and-platforms/server-types/bukkit-spigot.md))。还有一些类型是[混合型](../types-and-platforms/server-types/hybrids.md)，例如Magma，它们同时使用“模组”和“插件”。

## 可选的插件、模组和配置附加点

有一些可选的卷路径可以附加，以将内容复制到数据区域：

`/plugins`
: 此目录中的内容会同步到使用插件的服务器类型的`/data/plugins`，如上所述。对于特殊情况，可以通过设置`COPY_PLUGINS_SRC`更改源，通过设置`COPY_PLUGINS_DEST`更改目标。

`/mods`
: 此目录中的内容会同步到使用模组的服务器类型的`/data/mods`，如上所述。对于特殊情况，可以通过设置`COPY_MODS_SRC`更改源，通过设置`COPY_MODS_DEST`更改目标。

`/config`
: 内容默认同步到`/data/config`，但可以通过设置`COPY_CONFIG_DEST`更改。例如，`-v ./config:/config -e COPY_CONFIG_DEST=/data`允许你直接将文件如`bukkit.yml`等复制到服务器目录。可以通过设置`COPY_CONFIG_SRC`更改源。如果希望来自`/config`的文件优先于`/data/config`中的较新文件，请设置`SYNC_SKIP_NEWER_IN_DESTINATION=false`。

默认情况下，[环境变量处理](../configuration/interpolating.md)会在同步的文件上执行，这些文件匹配`REPLACE_ENV_SUFFIXES`中的预期后缀(默认值为"yml,yaml,txt,cfg,conf,properties,hjson,json,tml,toml")，并且不被`REPLACE_ENV_VARIABLES_EXCLUDES`和`REPLACE_ENV_VARIABLES_EXCLUDE_PATHS`排除。可以通过设置`REPLACE_ENV_DURING_SYNC`为`false`来禁用此处理。

如果你希望在从这些附加点引入内容之前删除旧的模组/插件，那么添加`-e REMOVE_OLD_MODS=TRUE`。你可以通过指定`REMOVE_OLD_MODS_INCLUDE`和`REMOVE_OLD_MODS_EXCLUDE`变量来微调删除过程，这些变量是以逗号分隔的文件全局模式列表。如果排除了目录，则该目录及其所有内容都将被排除。默认情况下，仅删除jar文件。

你还可以指定`REMOVE_OLD_MODS_DEPTH`(默认值为16)变量，以仅删除到某个级别的文件。

例如：`-e REMOVE_OLD_MODS=TRUE -e REMOVE_OLD_MODS_INCLUDE="*.jar" -e REMOVE_OLD_MODS_DEPTH=1`将删除`plugins/`或`mods/`目录中直接包含的所有旧jar文件。

如果你想在单独的位置拥有一组通用模块，但仍然在持久卷或可下载存档中拥有多个具有不同服务器需求的世界，这些路径效果很好。

!!! info ""
    为了更灵活地准备模组/插件，你可以在[`MODS` / `PLUGINS`变量](#modsplugins-list)中声明其他目录、文件和URL。

## Zip文件模组包

与上面的`WORLD`选项类似，你可以指定“模组包”的URL或容器路径，以下载并安装到Forge/Fabric的`mods`或Bukkit/Spigot的`plugins`中。要使用此选项，传递环境变量`MODPACK`，例如

```shell
docker run -d -e MODPACK=http://www.example.com/mods/modpack.zip ...
```

!!! note "注意"
    引用的URL/文件必须是zip文件，其中包含一个或多个jar文件在zip存档的顶层。确保jar文件与您正在运行的特定`TYPE`服务器兼容。

## 通用包文件

要安装来自zip或tgz文件的所有服务器内容(jar、模组、插件、配置等)，请将`GENERIC_PACK`设置为存档文件的容器路径或URL。这也可以用于应用缺少服务器启动脚本和/或Forge安装程序的CurseForge模组包。

如果需要同时应用多个通用包，请设置`GENERIC_PACKS`，并使用逗号分隔的存档文件路径和/或URL列表。

为了避免重复，每个条目都将由`GENERIC_PACKS_PREFIX`的值作为前缀，并由`GENERIC_PACKS_SUFFIX`的值作为后缀，这两者都是可选的。例如，以下变量

```
GENERIC_PACKS=configs-v9.0.1,mods-v4.3.6
GENERIC_PACKS_PREFIX=https://cdn.example.org/
GENERIC_PACKS_SUFFIX=.zip
```

将扩展为`https://cdn.example.org/configs-v9.0.1.zip,https://cdn.example.org/mods-v4.3.6.zip`。

如果应用大型通用包，更新可能会很耗时。要跳过更新，请将`SKIP_GENERIC_PACK_UPDATE_CHECK`设置为"true"。相反，可以通过将`FORCE_GENERIC_PACK_UPDATE`设置为"true"来强制应用通用包。

通用包更新中最耗时的部分是生成和比较SHA1校验和。要跳过校验和生成，请将`SKIP_GENERIC_PACK_CHECKSUM`设置为"true"。

## 模组/插件列表

你还可以使用`MODS`或`PLUGINS`环境变量下载或复制单个模组/插件。两者都是以逗号或换行符分隔的列表，包含
- jar文件的URL
- 容器路径到jar文件
- 容器路径到包含jar文件的目录

```shell
docker run -d -e MODS=https://www.example.com/mods/mod1.jar,/plugins/common,/plugins/special/mod2.jar ...
```

换行符分隔允许在compose文件中使用，例如：
```yaml
      PLUGINS: |
        https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot
        https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot
```

## 模组/插件URL列表文件

作为`MODS`/`PLUGINS`的替代，可以将`MODS_FILE`或`PLUGINS_FILE`变量设置为包含每行模组/插件URL的文本文件的容器路径或URL。例如，以下

     -e MODS_FILE=/extras/mods.txt

将从挂载到容器中的`/extras/mods.txt`文件加载。该文件可能如下所示：

```text
https://edge.forgecdn.net/files/2965/233/Bookshelf-1.15.2-5.6.40.jar
https://edge.forgecdn.net/files/2926/27/ProgressiveBosses-2.1.5-mc1.15.2.jar
# 这一行和下一行将被忽略
#https://edge.forgecdn.net/files/3248/905/goblintraders-1.3.1-1.15.2.jar
https://edge.forgecdn.net/files/3272/32/jei-1.15.2-6.0.3.16.jar
https://edge.forgecdn.net/files/2871/647/ToastControl-1.15.2-3.0.1.jar
```

!!! note "注意"

    空白行和以`#`开头的行将被忽略

    [此compose文件](https://github.com/itzg/docker-minecraft-server/blob/master/examples/mods-file/docker-compose.yml)展示了使用此功能的另一个示例。

## 删除旧的模组/插件

当指定了上面的`MODPACK`选项时，你还可以指示脚本在安装新模组/插件之前删除旧的模组/插件。如果你想从下载的zip文件升级模组/插件，这种行为是可取的。

要使用此选项，传递环境变量`REMOVE_OLD_MODS=TRUE`，例如

```shell
docker run -d -e REMOVE_OLD_MODS=TRUE -e MODPACK=http://www.example.com/mods/modpack.zip ...
```

!!! danger "危险"

    在从MODPACK或MODS解压新内容之前，`mods`或`plugins`目录中的所有内容将被删除。
