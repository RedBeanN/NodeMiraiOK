# NodeMiraiOK

快速部署基于 `NodeJS` 的 [mirai](https://github.com/mamoe/mirai) 机器人项目

依赖: `NodeJS v10.12.0+`

## Usage

### 安装 nmok

``` sh
npm i -g node-mirai-ok
```

### 创建和运行项目

``` sh
nmok create my-qq-bot
cd my-qq-bot
nmok run
```

## 其他

### 初始化 `node-mirai-sdk` 或 `mirai-ts` 项目模板

``` sh
nmok init <-t>
```

添加参数 `-t` 来使用 `mirai-ts`

编辑 `index.js` 中的相关配置, 然后:

``` sh
nmok run
```

现在在启动 `mirai-console` 后, `nmok` 还会自动运行 `index.js`, 你也可以使用

``` sh
nmok run --pure
```

只启动 `mirai-console` 而不运行 `index.js`

### 添加 `mirai-console` 插件

``` sh
nmok add mirai-api-http # 如果使用了 nmok init 此插件会自动安装
```

- 更多插件接入中, 插件作者如需接入请 [邮件联系](mailto://me@hongshn.xyz)

### 查看帮助

``` sh
nmok -h
```
