#!/usr/bin/env node
const { version } = require('./package.json');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

const checkMirai = require('./src/checkMirai');
const checkJava = require('./src/checkJava');
const checkPlugin = require('./src/checkPlugin');
const runMirai = require('./src/runMirai');

const configTemplate = [
  `# 在下面添加启动时要输入的指令`,
  `# 在 console 启动完成后会自动输入指令`,
  `# 如 login 123456789 passwd`,
  `# 以#开头的行会被忽略`,
].join('\n');

program.version(version);

program
.command(`create [dir]`)
.description('Create a Node Mirai One Key project')
.action(async (dir, cmd) => {
  if (!dir) {
    dir = `NodeMiraiOK`;
    console.warn(`[WARN] 未指定工作目录，默认使用 ./${dir}`);
  }
  const rootDir = path.resolve(process.cwd(), dir);
  // console.log(`Creating Node Mirai project`);
  console.log(`Root dir: ${rootDir}`);
  if (fs.existsSync((rootDir))) console.warn(`[WARN] 工作目录已存在，将进行非强制更新`);
  else fs.mkdirSync(rootDir, { recursive: true });
  await checkJava(rootDir);
  fs.writeFileSync(path.resolve(rootDir, `config.txt`), configTemplate);
  await checkMirai(rootDir);
  console.log(`初始化完成\n使用以下命令启动Mirai\n\tcd ${dir}\n\tnmok run`);
  console.log(`在${dir}目录下运行\n\tnmok add mirai-api-http\n即可安装httpapi插件`);
});

program
.command(`run`)
.option(`--noupdate`, `Don't update mirai`)
.option(`-F, --forceupdate`, `Force update mirai`)
.description(`Run mirai-console`)
.action(async (cmd) => {
  const cwd = path.resolve(process.cwd());
  const javaPath = await checkJava(cwd);
  if (!cmd.noupdate) {
    console.log(`正在检查Mirai三件套更新...`);
    await checkMirai(cwd, cmd.forceupdate);
  }
  const files = fs.readdirSync(cwd).filter(i => i.includes('console-wrapper'));
  if (files.length === 0) return console.error(`当前目录下未发现mirai-console-wrapper，使用 nmok create [dir] 来创建一个新项目`);
  if (files.length !== 1) return console.error(`当前目录下存在多个mirai-console-wrapper，请手动删除旧版本`);
  const config = path.resolve(cwd, `config.txt`);
  if (!fs.existsSync(config)) {
    fs.writeFileSync(config, configTemplate);
  }
  const cmds = fs.readFileSync(config)
                 .toString()
                 .split('\n')
                 .filter(i => !i.startsWith('#'));
  runMirai(files[0], javaPath, cmds);
});

program.command(`add [plugin]`)
.description(`Add mirai console plugin`)
.action((plugin) => {
  checkPlugin(path.resolve(process.cwd(), 'plugins'), plugin);
});

program.parse(process.argv);
