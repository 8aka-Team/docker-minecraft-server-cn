# 示例

各种示例都[保存在仓库中](https://github.com/itzg/docker-minecraft-server/tree/master/examples)。下面的章节重点介绍了一些特定的示例。

## 兼容基岩版的服务器

使用[GeyserMC插件](https://geysermc.org/)与Paper服务器(或类似服务器)“使Minecraft基岩版的客户端能够加入你的Minecraft Java服务器”。该示例还包括[Floodgate](https://wiki.geysermc.org/floodgate/)，它“允许经过Xbox Live认证的基岩版用户无需Java版账户即可加入”。

```yaml
services:
  mc:
    image: itzg/minecraft-server
    environment:
      EULA: "true"
      TYPE: "PAPER"
      PLUGINS: |
        https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot
        https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot
    ports:
      - "25565:25565"
      - "19132:19132/udp"
    volumes:
      - ./data:/data
```

[来源](https://github.com/itzg/docker-minecraft-server/blob/master/examples/geyser/docker-compose.yml)

## Lazymc - 在空闲时让Minecraft服务器休息

通过[lazymc-docker-proxy](https://github.com/joesturge/lazymc-docker-proxy)，你能够将[lazymc](https://github.com/timvisee/lazymc)与Minecraft容器一起使用。

```yaml
services:
  lazymc:
    container_name: lazymc
    image: ghcr.io/joesturge/lazymc-docker-proxy:latest
    environment:
      # 指向Minecraft服务器的服务名称
      SERVER_ADDRESS: mc:25565
      # 必须找到要管理的容器
      LAZYMC_GROUP: mc
    restart: unless-stopped
    volumes:
      # 你应该将Minecraft服务器目录挂载到/server下，使用只读模式。
      - data:/server:ro
      # 你需要提供docker socket，以便容器可以运行docker命令
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      # lazymc-docker-proxy充当代理，因此不需要在Minecraft容器上暴露服务器端口
      - "25565:25565"

  # 标准的Docker Minecraft服务器，也适用于其他服务器类型
  mc:
    image: itzg/minecraft-server:java21
    container_name: minecraft-server
    # 我们需要在这里添加一个标签，以便lazymc-docker-proxy知道要管理哪个容器
    labels:
      - lazymc.group=mc
    tty: true
    stdin_open: true
    # 这个容器应仅由lazymc容器管理，因此将重启设置为no，否则容器会再次启动...
    restart: no
    environment:
      EULA: "TRUE"
    volumes:
      - data:/data

volumes:
  data:
```
[来源](https://github.com/joesturge/lazymc-docker-proxy/blob/master/docker-compose.yaml)

## Lazytainer - 根据流量停止Minecraft容器

监控Minecraft容器的网络流量。如果有流量，容器运行，否则容器停止/暂停。

通过将[Lazytainer](https://github.com/vmorganp/Lazytainer)与[docker-minecraft-server](https://github.com/itzg/docker-minecraft-server)一起使用，可以实现与[Lazymc](https://github.com/timvisee/lazymc)类似的行为。

```yaml
services:
  lazytainer:
    image: ghcr.io/vmorganp/lazytainer:master
    environment:
      VERBOSE: false
    ports:
      - 25565:25565
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    labels:
      - lazytainer.group.minecraft.sleepMethod=stop
      - lazytainer.group.minecraft.ports=25565
      - lazytainer.group.minecraft.minPacketThreshold=2 # Start after two incomming packets
      - lazytainer.group.minecraft.inactiveTimeout=600 # 10 minutes, to allow the server to bootstrap. You can probably make this lower later if you want.
    restart: unless-stopped
    network_mode: bridge
  mc:
    image: itzg/minecraft-server
    environment:
      EULA: TRUE
      TYPE: PAPER
      MEMORY: 4G
    volumes:
      - ./data:/data
    labels:
      - lazytainer.group=minecraft
    depends_on:
      - lazytainer
    network_mode: service:lazytainer
    tty: true
    stdin_open: true
    restart: unless-stopped
```
[来源](https://github.com/itzg/docker-minecraft-server/blob/master/examples/lazytainer/docker-compose.yml)