#!/usr/bin/env node
const { version } = require('./package.json');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

const checkMirai = require('./src/checkMirai');

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
  await checkMirai(rootDir);
});

program
.command(`run`)
.option(`--noupdate`, `Don't update mirai`)
.option(`-F, --forceupdate`, `Force update mirai`)
.description(`Run mirai-console`)
.action(async (cmd) => {
  const cwd = path.resolve(process.cwd());
  if (!cmd.noupdate) await checkMirai(cwd, cmd.forceupdate);
  const files = fs.readdirSync(cwd).filter(i => i.includes('wrapper'));
});

program.parse(process.argv);
