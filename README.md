# NodeMiraiOK

快速部署基于 `NodeJS` 的 [mirai](https://github.com/mamoe/mirai) 机器人项目

## Usage

### 安装 nmok

``` sh
npm i -g node-mirai-ok
```

### 创建项目

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

编辑 `index.js` 中的相关配置

``` sh
nmok run
```

现在在启动 `mirai-console` 后, `nmok` 还会自动运行 `index.js`, 可以使用

``` sh
nmok run --pure
```

只启动 `mirai-console` 而不运行 `index.js`

### 添加 `mirai-console` 插件

``` sh
nmok add mirai-api-http
```

### 查看帮助

``` sh
nmok -h
```
