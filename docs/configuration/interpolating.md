---
title: 修改配置文件
---

## 替换配置文件中的变量

有时你可能有需要配置信息的模组或插件，这些信息只能在运行时获得。例如，如果你需要配置一个插件以连接到数据库，你不希望将这些信息包含在你的Git仓库或Docker镜像中。或者你可能有一些运行时信息，比如服务器名称，需要在容器启动后在配置文件中设置。

在这些情况下，可以选择用容器运行时定义的环境变量替换配置文件中定义的变量。

当环境变量`REPLACE_ENV_IN_PLACE`设置为`true`(默认值)时，启动脚本将遍历容器内`/data`路径下的所有文件，并替换与容器环境变量匹配的变量。通过将`REPLACE_ENV_DURING_SYNC`设置为`true`(默认为`false`)，变量也可以(或另外)在从`/plugins`、`/mods`和`/config`同步的文件中替换。

你想要替换的变量需要在花括号内声明，并以美元符号为前缀，例如`${CFG_YOUR_VARIABLE}`，这与许多脚本语言相同。

你还可以更改`REPLACE_ENV_VARIABLE_PREFIX`，其默认值为"CFG_"，以限制允许使用的环境变量。例如，使用"CFG_"作为前缀，变量`${CFG_DB_HOST}`将被替换，但`${DB_HOST}`不会。前缀可以设置为空字符串，以允许匹配任何变量名。

如果你想使用文件内容作为值，例如在使用作为文件挂载的秘密时，在文件中声明与正常名称相同的占位符，并声明一个名称相同但带有`_FILE`后缀的环境变量。

例如，`my.cnf`文件可能包含：

```
[client]
password = ${CFG_DB_PASSWORD}
```

...在compose文件中声明的隐私变量：
```yaml
secrets:
  db_password:
    external: true
```

...最后，环境变量将以`_FILE`后缀命名，并指向挂载的隐私变量：
```yaml
    environment:
      CFG_DB_PASSWORD_FILE: /run/secrets/db_password
```

变量将在具有以下扩展名的文件中替换：
`.yml`, `.yaml`, `.txt`, `.cfg`, `.conf`, `.properties`.

可以通过在变量`REPLACE_ENV_VARIABLES_EXCLUDES`中列出其名称(不带路径)来排除特定文件。

可以通过在变量`REPLACE_ENV_VARIABLES_EXCLUDE_PATHS`中列出路径来排除路径。路径排除是递归的。这里是一个示例：
```
REPLACE_ENV_VARIABLES_EXCLUDE_PATHS="/data/plugins/Essentials/userdata /data/plugins/MyPlugin"
```

这里是一个完整的示例，我们希望在`database.yml`中替换值。

```yml

---
database:
  host: ${CFG_DB_HOST}
  name: ${CFG_DB_NAME}
  password: ${CFG_DB_PASSWORD}
```

这是你的`docker-compose.yml`文件可能的样子：

```yml
# 其他docker-compose示例在/examples中

services:
  minecraft:
    image: itzg/minecraft-server
    ports:
      - "25565:25565"
    volumes:
      - "mc:/data"
    environment:
      EULA: "TRUE"
      ENABLE_RCON: "true"
      RCON_PASSWORD: "testing"
      RCON_PORT: 28016
      # 启用环境变量替换
      REPLACE_ENV_VARIABLES: "TRUE"
      # 定义你想要替换的环境变量的可选前缀
      ENV_VARIABLE_PREFIX: "CFG_"
      # 这里是实际的变量
      CFG_DB_HOST: "http://localhost:3306"
      CFG_DB_NAME: "minecraft"
      CFG_DB_PASSWORD_FILE: "/run/secrets/db_password"

volumes:
  mc:
  rcon:

secrets:
  db_password:
    file: ./db_password
```

## 修补现有文件

通过将变量`PATCH_DEFINITIONS`设置为包含一个或多个[修补定义json文件](https://github.com/itzg/mc-image-helper#patchdefinition)或[修补集json文件](https://github.com/itzg/mc-image-helper#patchset)的目录路径，可以对一个或多个现有文件应用基于JSON路径的修补。

修补定义中的`file`和`value`字段可能包含`${...}`变量占位符。可以通过设置`REPLACE_ENV_VARIABLE_PREFIX`(默认为"CFG_")来限制占位符中允许的环境变量。

以下示例显示了一个修补集文件，其中可以修改和添加`paper.yaml`配置文件中的各种字段：

```json
{
  "patches": [
    {
      "file": "/data/paper.yml",
      "ops": [
        {
          "$set": {
            "path": "$.verbose",
            "value": true
          }
        },
        {
          "$set": {
            "path": "$.settings['velocity-support'].enabled",
            "value": "${CFG_VELOCITY_ENABLED}",
            "value-type": "bool"
          }
        },
        {
          "$put": {
            "path": "$.settings",
            "key": "my-test-setting",
            "value": "testing"
          }
        }
      ]
    }
  ]
}
```

支持的文件格式：

- JSON
- JSON5
- Yaml
- TOML，但处理后的输出不美观