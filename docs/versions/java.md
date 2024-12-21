## 镜像标签

镜像引用可以省略标签，这意味着使用标签 `latest`，例如：

    itzg/minecraft-server

或者明确包含标签，例如：

    itzg/minecraft-server:<tag>

其中 `<tag>` 指的是此表的第一列：

| 标签               | Java 版本 | Linux  | JVM 类型             | 架构                  |
|------------------|---------|--------|--------------------|---------------------|
| latest           | 21      | Ubuntu | Hotspot            | amd64, arm64        |
| stable           | 21      | Ubuntu | Hotspot            | amd64, arm64        |
| java21           | 21      | Ubuntu | Hotspot            | amd64, arm64        |
| java21-jdk       | 21      | Ubuntu | Hotspot+JDK        | amd64, arm64        |
| java21-alpine    | 21      | Alpine | Hotspot            | amd64, arm64        |
| java21-graalvm   | 21      | Oracle | Oracle GraalVM[^1] | amd64, arm64        |   
| java17           | 17      | Ubuntu | Hotspot            | amd64, arm64, armv7 |
| java17-graalvm   | 17      | Oracle | Oracle GraalVM[^1] | amd64, arm64        |   
| java17-alpine    | 17      | Alpine | Hotspot            | amd64  (1)          |
| java11           | 11      | Ubuntu | Hotspot            | amd64, arm64, armv7 |
| java8            | 8       | Ubuntu | Hotspot            | amd64, arm64, armv7 |
| java8-jdk        | 8       | Ubuntu | Hotspot+JDK        | amd64               |
| java8-openj9     | 8       | Debian | OpenJ9             | amd64               |
| java8-graalvm-ce | 8       | Oracle | GraalVM CE         | amd64               |

1. 为什么 Java 17 Alpine 没有 arm64？这是因为基础镜像，例如 [elipse-temurin](https://hub.docker.com/_/eclipse-temurin/tags?page=&page_size=&ordering=&name=17-jre-alpine) 不提供对该架构的支持。请改用基于 Ubuntu 的镜像。

!!! example "使用 java8 的示例"

    使用 docker run 命令行
    
    ```
    docker run -it -e EULA=true itzg/minecraft-server:java8
    ```
    
    或在 compose 文件中
    
    ```yaml
    services:
      mc:
        image: itzg/minecraft-server:java8
    ```

!!! note "Latest"

    "latest" 标签不仅包含最新的功能和错误修复，还包含 Mojang 要求的最新 Minecraft 版本的最新 Java 版本。

!!! note "类文件版本"

    如果 Minecraft 启动时记录了关于 "类文件版本" 的错误，请参考 [此表](https://javaalmanac.io/bytecode/versions/) 以识别与每个类文件版本对应的 JDK/Java 版本。

### 发布版本

由于上述标签会随着最新镜像构建引入新功能和错误修复而变化，因此也可以使用这些标签的发布变体来固定特定构建的镜像。

发布镜像标签的语法是：

    itzg/minecraft-server:<release>-<java tag>

其中 `java tag` 仍然指的是上表的第一列，`release` 指的是 [其中一个镜像发布版本](https://github.com/itzg/docker-minecraft-server/releases)。

!!! example "实例"

    例如，Java 17 镜像的 2024.4.0 发布版本将是
    
    ```
    itzg/minecraft-server:2024.4.0-java17
    ```

### 稳定镜像标签

`stable` 镜像标签结合了 `latest` 和 [发布版本](#release-versions) 的优点，因为它会更新为最近发布的版本。

## 版本兼容性

[NitWikit 中的这一部分](https://nitwikit.yizhan.wiki/preparation/choose-and-download-and-install-java/) 列出了 Minecraft 版本及其所需的相应 Java 版本。

### 类文件版本 65.0

如果遇到类似于以下示例的启动失败，请确保已重新拉取最新镜像以使用 Java 21。或者，将镜像标签明确设置为 `itzg/minecraft-server:java21`。

> Exception in thread "ServerMain" java.lang.UnsupportedClassVersionError: org/bukkit/craftbukkit/Main has been compiled by a more recent version of the Java Runtime (class file version 65.0), this version of the Java Runtime only recognizes class file versions up to 61.0

或

> Error: LinkageError occurred while loading main class net.minecraft.bundler.Main
java.lang.UnsupportedClassVersionError: net/minecraft/bundler/Main has been compiled by a more recent version of the Java Runtime (class file version 65.0), this version of the Java Runtime only recognizes class file versions up to 61.0

### Forge 版本

Forge 及其模组有时会使用 JVM 的非公开 API，因此容易在新 Java 版本中出现问题。

#### Java 21

即使到 Minecraft 1.21 的一些模组也需要 Java 17，并且不会在最新 Java 版本上运行。如果你看到类似以下的错误，请确保明确使用 Java 17 标签的镜像：

```
Caused by: org.spongepowered.asm.mixin.throwables.ClassMetadataNotFoundException: java.util.List
	at MC-BOOTSTRAP/org.spongepowered.mixin/org.spongepowered.asm.mixin.transformer.MixinPreProcessorStandard.transformMethod(MixinPreProcessorStandard.java:754)
```

#### Java 8

对于低于 1.18 的 Forge 版本，你必须使用 `java8-multiarch`（或其他 java8）镜像标签。

通常，如果你在服务器启动失败中看到以下行，这意味着你需要使用 Java 8 而不是最新镜像的 Java 版本：

```
Caused by: java.lang.ClassCastException: class jdk.internal.loader.ClassLoaders$AppClassLoader 
   cannot be cast to class java.net.URLClassLoader
```

Forge 也不支持 openj9 JVM 实现。

## 已弃用的镜像标签

以下镜像标签已被弃用，不再接收更新：

- java19
- adopt13
- adopt14
- adopt15
- openj9-nightly
- multiarch-latest
- java16/java16-openj9
- java17-graalvm-ce
- java17-openj9
- java20-graalvm, java20, java20-alpine
- java8-multiarch 仍然构建和推送，但请迁移到 java8
- java8-alpine

[^1]: 基于 [Oracle GraalMV 镜像](https://blogs.oracle.com/java/post/new-oracle-graalvm-container-images)，从 JDK 17 开始，现在基于 [GraalVM 免费许可证](https://blogs.oracle.com/java/post/graalvm-free-license)，整合了以前称为 GraalVM Enterprise 的内容。