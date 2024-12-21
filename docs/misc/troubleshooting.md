# 初始化

要排查容器初始化问题，例如当服务器文件预下载时，请将环境变量 `DEBUG` 设置为 `true`。容器日志将包含**更多**输出，强烈建议在报告任何[问题](https://github.com/itzg/docker-minecraft-server/issues)时包含这些输出。

要排查用于启动Minecraft服务器的命令行问题，请将环境变量 `DEBUG_EXEC` 设置为 `true`。

要排查JVM报告的内存分配问题，请将环境变量 `DEBUG_MEMORY` 设置为 `true`。

如果你在“更改/data的所有权”步骤中遇到任何问题，可以通过将 `SKIP_CHOWN_DATA` 设置为 `true` 来禁用该步骤。
