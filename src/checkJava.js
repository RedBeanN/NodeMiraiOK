const os = require('os');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const unrar = require('node-unrar-js');
const { spawn } = require('child_process');
const download = require('./download');

const getJavaVersion = async (dir = '') => {
  // DEBUG
  // throw '';
  // if (!dir.length) throw '';
  if (dir.length) javaPath = path.resolve(dir, 'java');
  else javaPath = `java`;
  const java = spawn(javaPath, [`-version`]);
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
    console.log(1);
    try {
      const v = await getJavaVersion();
      console.log(`JRE:${v.trim()}`)
      return `java`;
    } catch (e) {
      console.log(path.resolve(rootDir, 'jre/bin/'));
      const v = await getJavaVersion(path.resolve(rootDir, 'jre/bin/'));
      console.log(`Local JRE:${v.trim()}`);
      return path.resolve(rootDir, 'jre/bin/java');
    }
  } catch (e) {
    console.log(`未发现JRE，准备下载...`);
    const sysInfo = getSysInfo();
    const javaUrl = await axios.get(`http://api.redbean.tech:64724/Java/${sysInfo}`).catch(() => {
      console.error(`无法获取JRE，即将退出，请手动安装JRE后重试`);
      process.exit(0);
    });
    await download(javaUrl.data, path.resolve(rootDir, `jre-${sysInfo}.rar`));
    const extractor = unrar.createExtractorFromFile(
      path.resolve(rootDir, `jre-${sysInfo}.rar`),
      rootDir
    );
    const files = extractor.getFileList()[1].fileHeaders.map(i => i.name);
    // FIX: unrar 无法识别嵌套文件夹
    files.forEach(file => {
      const paths = file.split('/');
      const dir = path.resolve(rootDir, paths.slice(0, paths.length - 1).join('/'));
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    })
    extractor.extractAll();
    fs.unlinkSync(path.resolve(rootDir, `jre-${sysInfo}.rar`));
    return path.resolve(rootDir, `jre/bin/java`);
  }
};

module.exports = checkJava;
// checkJava().then(console.log);