# NodeMiraiOK

快速部署基于 `NodeJS` 的 [mirai](https://github.com/mamoe/mirai) 机器人项目

依赖: `NodeJS v10.12.0+`

## 已经能做到

- 自动下载和更新 [mirai](https://github.com/mamoe/mirai) 三件套
- 自动配置 `Java` 环境
- 自动登录
- 一键安装 [mirai-console](https://github.com/mamoe/mirai-console) 插件(Beta)
- 快速配置并随 `console` 运行 [node-mirai-sdk](https://github.com/RedBeanN/node-mirai) 或 [mirai-ts](https://github.com/YunYouJun/mirai-ts) 项目

## Usage

### 安装 nmok

``` sh
npm i -g node-mirai-ok
```

### 安装和运行`mirai-console`

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
