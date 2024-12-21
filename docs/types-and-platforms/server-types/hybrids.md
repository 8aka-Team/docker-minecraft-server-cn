# 混合

### Magma

一个 [Magma](https://magmafoundation.org/) 服务器，它是 Forge 和 PaperMC 的结合体，可以使用

    -e TYPE=MAGMA

!!! note "注意"

    Magma 项目已经终止（[原链接失效](https://git.magmafoundation.org/magmafoundation/magma-1-20-x/-/commit/4e7abe37403c47d09b74b77bcfc26a19b18f5891)，[Discord 上的替代声明](https://discord.com/channels/612695539729039411/647287352833605662/1174412642962649198)）。请使用 Magma Maintained 用于 1.12.2、1.18.2 和 1.19.3，或使用 Ketting 用于 1.20.1+。

    支持的基础版本有限，因此您还需要设置 `VERSION`，例如 "1.12.2"、"1.16.5" 等。

### Magma Maintained

一个 [Magma Maintained](https://github.com/magmamaintained/) 服务器，它是 Magma 的替代项目，可以使用

    -e TYPE=MAGMA_MAINTAINED

!!! note "注意"

    支持的基础版本有限，因此您还需要设置 `VERSION`，例如 "1.12.2"、"1.18.2"、"1.19.3" 或 "1.20.1"。

    此外，必须指定 `FORGE_VERSION` 和 `MAGMA_MAINTAINED_TAG`。您可以在每个仓库的发布页面找到支持的 `FORGE_VERSION` 和 `MAGMA_MAINTAINED_TAG`。

### Ketting

一个 [Ketting](https://github.com/kettingpowered/Ketting-1-20-x) 服务器，它是 Magma 1.20.1+ 的替代项目，可以使用

    -e TYPE=KETTING

支持的基础版本有限，因此您还需要设置 `VERSION`，例如 "1.20.1" 或更高版本。

可以指定 `FORGE_VERSION` 和 `KETTING_VERSION`；但是，如果未指定，它们将由 [Ketting launcher](https://github.com/kettingpowered/kettinglauncher) 默认设置。
可用的 Ketting 版本可以在 [https://reposilite.c0d3m4513r.com/#/Ketting-Server-Releases/org/kettingpowered/server/forge](https://reposilite.c0d3m4513r.com/#/Ketting-Server-Releases/org/kettingpowered/server/forge) 找到。
版本结构为 `MinecraftVersion-ForgeVersion-KettingVersion`（例如 `1.20.1-47.2.20-0.1.4` 适用于 Minecraft `1.20.1`，Forge `47.2.20` 和 Ketting `0.1.4`）。

### Mohist

一个 [Mohist](https://github.com/MohistMC/Mohist) 服务器可以使用

    -e TYPE=MOHIST

!!! note "注意"

    支持的基础版本有限，因此您还需要设置 `VERSION`，例如 "1.12.2"

默认情况下将使用最新构建；但是，可以通过设置 `MOHIST_BUILD` 来选择特定构建号，例如

    -e VERSION=1.16.5 -e MOHIST_BUILD=374

### Catserver

一个 [Catserver](http://catserver.moe/) 类型的服务器可以使用

    -e TYPE=CATSERVER

> **注意** Catserver 仅提供单一发布流，因此 `VERSION` 被忽略