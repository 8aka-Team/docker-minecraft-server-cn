# 使用Spiget自动下载

`SPIGET_RESOURCES`变量可以设置为一个以逗号分隔的SpigotMC资源ID列表，以使用[Spiget API](https://spiget.org/)自动下载[Spigot/Bukkit/Paper插件](https://www.spigotmc.org/resources/)。如果是zip文件的资源将被解压到插件目录，而仅仅是jar文件的资源将被移动到该目录。

!!! important "是SPIGET不是SPIGOT"
    该变量故意拼写为SPIG**E**T，带有一个"E"

**资源ID**可以从URL中短名称/slug之后的数字部分找到。例如，从以下URL中，ID是**28140**：

    https://www.spigotmc.org/resources/luckperms.28140/
                                                 =====

例如，以下命令将自动下载[LuckPerms](https://www.spigotmc.org/resources/luckperms.28140/)和[Vault](https://www.spigotmc.org/resources/vault.34315/)插件：

    -e SPIGET_RESOURCES=28140,34315

!!! note "注意"
    一些插件，例如EssentialsX(资源ID 9089)，不允许通过Spiget进行自动下载。相反，你需要预先下载所需的文件并将其提供给容器，例如使用`/plugins`挂载点，如[主节](index.md)中所述。