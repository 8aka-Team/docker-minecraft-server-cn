# Packwiz 模组包

[packwiz](https://packwiz.infra.link/) 是一个用于维护和提供模组包定义的 CLI 工具，支持 CurseForge 和 Modrinth 作为来源。更多信息请参阅 [packwiz 教程](https://packwiz.infra.link/tutorials/getting-started/)。

要使用 packwiz 模组包配置服务器模组，请将 `PACKWIZ_URL` 环境变量设置为您的 `pack.toml` 模组包定义的位置：

```
docker run -d -v /path/on/host:/data -e TYPE=FABRIC \
    -e "PACKWIZ_URL=https://example.com/modpack/pack.toml" \
    itzg/minecraft-server
```

packwiz 模组包定义会在其他模组定义(如 `MODPACK`、`MODS` 等)之前进行处理，以允许您可能希望执行的额外处理/覆盖(例如，对于无法通过 Modrinth/CurseForge 获得的模组，或者您不维护的模组包)。

!!! note "注意"

    packwiz 预配置为仅下载服务器模组。如果下载了客户端模组并导致问题，请检查您的 pack.toml 配置，并确保任何仅客户端模组未设置为 `"both"`，而是设置为 `"client"` 作为 side 配置项。