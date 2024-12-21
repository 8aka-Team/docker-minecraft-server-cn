# 从CurseForge自动下载

通过将`CURSEFORGE_FILES`设置为逗号或空格分隔的[项目文件引用](#project-file-references)列表，可以从CurseForge自动下载和升级模组和插件。从声明中移除的引用将自动清理，将`CURSEFORGE_FILES`设置为空字符串将移除所有先前管理的项目文件。

可以省略每个引用中的特定文件，以允许自动选择所选模组/插件的最新版本。解析的`VERSION`和`TYPE`将用于选择适当的文件。

!!! warning "CurseForge API密钥使用"

    必须分配并使用`CF_API_KEY`设置CurseForge API密钥，[如这里所述](../types-and-platforms/mod-platforms/auto-curseforge.md#api-key)。

## 项目文件引用

!!! tip "提示"

    单个项目文件通常代表模组/插件的一个版本，但CurseForge将这些项目广泛称为“文件”而不是“版本”。

以下格式支持在项目文件引用列表中：

- 项目页面URL，例如`https://www.curseforge.com/minecraft/mc-mods/jei`。_将自动选择最新的适用文件。_
- 文件页面URL，例如`https://www.curseforge.com/minecraft/mc-mods/jei/files/4593548`
- 项目标识符，例如`jei`。_将自动选择最新的适用文件。_
- 项目ID，例如`238222`。_将自动选择最新的适用文件。_
- 项目标识符或ID，`:`，和文件ID，例如`jei:4593548`或`238222:4593548`
- 项目标识符或ID，`@`，和部分文件名，例如`jei@10.2.1.1005`。此选项有助于引用模组/插件的版本，而不是查找文件ID。

也可以提供一个以`@`开头的容器路径到列表文件作为项目文件引用。每行都作为引用处理，其中空白行和以`#`开头的注释被忽略。

例如，可以将`CURSEFORGE_FILES`设置为`@/extras/cf-mods.txt`，其中容器文件`/extras/cf-mods.txt`包含

```text
# 此注释被忽略
jei:10.2.1.1005

# 此行和之前的空白行被忽略
geckolib
aquaculture
naturalist
```

!!! tip "Docker Compose"

    利用空格分隔的选项，compose文件声明可以通过[多行字符串](https://yaml-multiline.info/)很好地组织，例如
    
    ```yaml
          CURSEFORGE_FILES: |
            geckolib
            aquaculture
            naturalist
    ```

## 依赖项

文件处理可以检测给定列表中是否缺少依赖项，但由于其元数据仅提供模组ID而不是所需的特定文件版本/ID，因此无法解析依赖项。
