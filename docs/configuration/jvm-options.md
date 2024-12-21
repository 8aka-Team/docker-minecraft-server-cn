# JVM 选项

## 内存限制

默认情况下，镜像声明了初始和最大 Java 内存堆限制为 1 GB。有几种方法可以调整内存设置：

- `MEMORY`：默认为 "1G"，可用于调整 JVM 的初始 (`Xms`) 和最大 (`Xmx`) 内存堆设置
- `INIT_MEMORY`：独立设置初始堆大小
- `MAX_MEMORY`：独立设置最大堆大小

所有三个值都直接传递给 JVM，并支持格式/单位为 `<size>[g|G|m|M|k|K]`。

!!! 示例 "使用 docker run"

    ```
        -e MEMORY=2G
    ```

    或者使用初始和最大内存：

    ```
        -e INIT_MEMORY=1G -e MAX_MEMORY=4G
    ```

!!! 示例 "使用 compose 文件"

    ```
        environment:
          MEMORY: 2G
    ```

    或者使用初始和最大内存：

    ```
        environment:
          INIT_MEMORY: 1G
          MAX_MEMORY: 4G
    ```

要让 JVM 从容器声明的内存限制中计算堆大小，请使用空值取消设置 `MEMORY`，例如 `-e MEMORY=""`。默认情况下，JVM 将使用容器内存限制的 25% 作为堆限制；然而，例如，以下内容将告诉 JVM 使用 4GB 内存限制的 75%：

!!! 示例 "使用 compose 文件设置 MaxRAMPercentage"

    ```
        environment:
          MEMORY: ""
          JVM_XX_OPTS: "-XX:MaxRAMPercentage=75"
        deploy:
          limits:
            memory: 4G  
    ```

!!! important  "重要"
    上述设置仅设置 Java **堆** 限制。容器整体的内存资源请求和限制也应考虑非堆内存使用。额外增加 25% 是一个[一般最佳实践](https://dzone.com/articles/best-practices-java-memory-arguments-for-container)。

## 额外 JVM 选项

可以通过传递 `JVM_OPTS` 环境变量将通用 JVM 选项传递给 Minecraft 服务器调用。JVM 要求 `-XX` 选项在 `-X` 选项之前，因此可以在 `JVM_XX_OPTS` 中声明这些选项。这两个变量都是以空格分隔的原始 JVM 参数。

```
docker run ... -e JVM_OPTS="-someJVMOption someJVMOptionValue" ...
```

**注意** 当在 compose 文件的 `environment` 部分使用列表语法声明 `JVM_OPTS` 时，**不要** 包含引号：

```yaml
    environment:
      - EULA=true
      - JVM_OPTS=-someJVMOption someJVMOptionValue 
```

建议使用对象语法，更直观：

```yaml
    environment:
      EULA: "true"
      JVM_OPTS: "-someJVMOption someJVMOptionValue"
# 或者
#     JVM_OPTS: -someJVMOption someJVMOptionValue
```

作为传递多个系统属性作为 `-D` 参数的简写，您可以传递一个逗号分隔的 `name=value` 或 `name:value` 对列表，使用 `JVM_DD_OPTS`。(提供了冒号语法，以便像 Plesk 这样的管理平台不允许在值中使用 `=`。)

例如，不传递

```yaml
  JVM_OPTS: -Dfml.queryResult=confirm -Dname=value
```

您可以使用

```yaml
  JVM_DD_OPTS: fml.queryResult=confirm,name=value
```

## 启用远程 JMX 进行分析

要启用远程 JMX，例如使用 VisualVM 或 JMC 进行分析，请将环境变量 `ENABLE_JMX` 设置为 "true"，将 `JMX_HOST` 设置为运行 Docker 容器的 IP/主机，并添加 TCP 端口 7091 的端口转发，例如：

!!! 示例

    使用 `docker run`

    ```
    -e ENABLE_JMX=true -e JMX_HOST=$HOSTNAME -p 7091:7091
    ```

如果需要映射到不同的端口，则还应将环境变量 `JMX_PORT` 设置为所需的主机端口。

!!! 示例

    使用 compose 文件：

    ```yaml
    environment:
      ENABLE_JMX: true
      JMX_HOST: ${HOSTNAME}
      JMX_PORT: "7092"
    ports:
      - "7092:7092"
    ```

## 启用 Aikar 的标志

[Aikar 进行了一些研究](https://aikar.co/2018/07/02/tuning-the-jvm-g1gc-garbage-collector-flags-for-minecraft/)，找到了 GC 调优的最佳 JVM 标志，随着更多用户同时连接，这变得越来越重要。[PaperMC 也有解释](https://docs.papermc.io/paper/aikars-flags) JVM 标志的作用。

可以通过添加以下内容来使用文档中的标志集：

    -e USE_AIKAR_FLAGS=true

当 `MEMORY` 大于或等于 12G 时，Aikar 标志将根据文章进行调整。
