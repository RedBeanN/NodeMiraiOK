const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const checkPlugin = require('./checkPlugin');

const jsTemplate = fs.readFileSync(path.resolve(__dirname, '../templates/node-mirai-sdk.js'));
const tsTemplate = fs.readFileSync(path.resolve(__dirname, '../templates/mirai-ts.js'));

const npmCmd = process.platform.includes(`win`) ? `npm.cmd` : `npm`;

const initNpm = () => new Promise((resolve, reject) => {
  const init = spawn(npmCmd, [`init`, `-y`]);
  init.on(`error`, () => {
    console.error(`执行 npm init 时发生错误，请尝试手动执行该命令`);
    reject();
  });
  init.stdout.on(`data`, data => {
    console.log(data.toString().trim());
  });
  init.stderr.on(`data`, data => {
    console.error(`Error:`, data.toString().trim());
  });
  init.on(`close`, resolve);
});

const install = async pack => new Promise((resolve, reject) =>{
  const ins = spawn(npmCmd, [`i`, `-S`, pack]);
  ins.on(`error`, () => {
    console.error(`安装 ${pack} 时发生错误，请尝试手动安装`);
    reject();
  });
  ins.stdout.on(`data`, data => {
    console.log(data.toString().trim());
  });
  ins.stderr.on(`data`, data => {
    console.error(data.toString().trim());
  });
  ins.on(`close`, resolve);
});

const initJS = async (rootDir) => {
  await checkPlugin(rootDir, `mirai-api-http`);
  const packagePath = path.resolve(rootDir, `package.json`);
  if (!fs.existsSync(packagePath)) {
    console.log(`未发现 npm 项目，执行 npm init`);
    await initNpm();
  }
  console.log(`正在执行 npm i -S node-mirai-sdk`);
  await install(`node-mirai-sdk`);
  if (!fs.existsSync(path.resolve(rootDir, `index.js`))) {
    console.log(`正在创建模板文件`);
    fs.writeFileSync(path.resolve(rootDir, `index.js`), jsTemplate);
  }
  console.log(`执行\n\tnmok run\n来运行 mirai 项目`);
};

const initTS = async (rootDir) => {
  await checkPlugin(path.resolve(rootDir, `plugins`), `mirai-api-http`);
  const packagePath = path.resolve(rootDir, `package.json`);
  if (!fs.existsSync(packagePath)) {
    console.log(`未发现 npm 项目，执行 npm init`);
    await initNpm();
  }
  console.log(`正在执行 npm i -S mirai-ts`);
  await install(`mirai-ts`);
  if (!fs.existsSync(path.resolve(rootDir, `index.js`))) {
    console.log(`正在创建模板文件`);
    fs.writeFileSync(path.resolve(rootDir, `index.js`), tsTemplate);
  }
};

module.exports = {
  initJS,
  initTS,
};
