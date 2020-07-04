const os = require('os');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');
const download = require('./download');

const getJavaVersion = async () => {
  // DEBUG
  throw '';
  const java = spawn(`java`, [`-version`]);
  return new Promise((resolve, reject) => {
    java.on('error', reject);
    java.stdout.on(`data`, data => {
      data = data.toString();
      return resolve(data);
    });
    java.stderr.on(`data`, data => {
      data = data.toString();
      return resolve(data);
    });
  });
};

const getSysInfo = () => {
  const platform = os.platform();
  const OS = platform === 'win32' ? 'windows' : platform;
  const arch = os.arch();
  let ARCH = arch;
  switch(arch) {
    case 'x32':
      ARCH = '386';
      break;
    case 'x64':
      ARCH = 'amd64';
      break;
  }
  return `${OS}-${ARCH}`;
};

// console.log(getSysInfo());

const checkJava = async (rootDir = process.cwd()) => {
  try {
    const v = await getJavaVersion();
    console.log(`JRE:${v.trim()}`)
    return `java`;
  } catch (e) {
    console.log(`未发现JRE，准备下载...`);
    const sysInfo = getSysInfo();
    const javaUrl = await axios.get(`http://api.redbean.tech:64724/Java/${sysInfo}`).catch(() => {
      console.error(`无法获取JRE，即将退出，请手动安装JRE后重试`);
      process.exit(0);
    });
    await download(javaUrl.data, path.resolve(rootDir, `jre-${sysInfo}.rar`));
    // TODO: extract rar
  }
};

module.exports = checkJava;
checkJava();
