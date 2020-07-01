#!/usr/bin/env node
const { version } = require('./package.json');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program.version(version);

program
.command(`create [dir]`)
.option('-t, --ts', 'Use mirai-ts')
.description('Create a Node Mirai One Key project')
.action((dir, cmd) => {
  const rootDir = path.resolve(process.cwd(), dir);
  console.log(`Creating Node Mirai project`);
  console.log(`Root dir: ${rootDir}`);
  if (fs.existsSync((rootDir))) console.warn(`[WARN] root directory is already exist`);
  else fs.mkdirSync(rootDir, { recursive: true });
});

program.parse(process.argv);
