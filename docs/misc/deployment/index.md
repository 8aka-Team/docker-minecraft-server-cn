# 更多部署信息

## 在 Kubernetes 上

### 使用 Helm

- itzg Helm Chart:
    - [GitHub 仓库](https://github.com/itzg/minecraft-server-charts)
      - [Helm Chart 仓库](https://itzg.github.io/minecraft-server-charts/)
- [mcsh/server-deployment](https://github.com/mcserverhosting-net/charts)

### 使用 Shulker

[Shulker](https://github.com/jeremylvln/Shulker) 是一个用于管理复杂和动态 Minecraft 基础设施的 Kubernetes 操作符，包括游戏服务器和代理。它在底层使用了 docker-minecraft-server 和 docker-bungeecord 镜像。

## 在 CloudFormation (AWS) 上

如果你正在寻找一种简单的方法将此部署到 Amazon Web Services 云上，请查看 [Minecraft 服务器部署 (CloudFormation) 仓库](https://github.com/vatertime/minecraft-spot-pricing)。该仓库包含一个 CloudFormation 模板，可以在几分钟内在 AWS 上启动并运行。可选地，它使用 Spot Pricing，因此服务器非常便宜，并且可以在不使用时轻松关闭。

## 支持文章

以下是服务器部署的支持文章。

- "从零到 Minecraft 服务器与 Docker Desktop 和 Compose"

    https://dev.to/rela-v/zero-to-minecraft-server-with-docker-desktop-and-compose-500a

    - 这是一个参考指南/教程，介绍如何使用此项目设置一个原版 Minecraft 服务器，包括分步说明，以及有关端口转发等主题的信息。