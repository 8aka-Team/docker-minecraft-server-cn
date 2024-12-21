# 在树莓派上运行

要在树莓派 3 B+、4 或更新的型号上运行此镜像，请使用 [Java 版本部分](../versions/java.md) 中列出的任何指定 `armv7` 架构的镜像标签，其中包括 `itzg/minecraft-server:latest`。

!!! note "注意"

    你可能需要降低内存分配，例如 `-e MEMORY=750m`

!!! note "注意"

    如果遇到诸如 "sleep: cannot read realtime clock: Operation not permitted" 的问题，请确保主机上的 `libseccomp` 是最新的。在某些情况下，可能需要为 `/data` 挂载添加 `:Z` 标志，[但请谨慎使用](https://docs.docker.com/storage)