const fs = require('fs');
const path = require('path');
const axios = require('axios');

const getMiraiVersion = require('./getMiraiVersion');
const download = require('./download');

const jarUrl = `http://api.redbean.tech:64724/Mirai/`

const checkMirai = async (rootDir, forceUpdate = false) => {
  if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir, { recursive: true });
  const release = await getMiraiVersion();
  if (typeof release !== 'object') throw new Error('无法获取版本信息');
  if (forceUpdate) console.log(`正在准备强制更新`);
  for (let r of release) {
    const dir = path.resolve(rootDir, r.path);
    const latest = `${r.name}-${r.version}.jar`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const files = fs.readdirSync(dir).filter(i => i.startsWith(r.name));
    if (files.includes(latest)) {
      if (!forceUpdate) {
        console.log(`${r.name} 已经是最新版`);
        continue;
      }
    }
    // else console.log(`> ${latest}`);
    try {
      const jar = `${jarUrl}${r.name}/${r.version}`;
      const url = (await axios.get(jar)).data;
      await download(url, path.resolve(dir, latest));
      console.log(`> ${latest} 下载完成`);
    } catch (e) {
      console.error(`无法下载 ${latest}，准备退出`);
      process.exit(1);
    } finally {
      // remove old jar
      for (let file of files) {
        if (file !== latest) fs.unlinkSync(path.resolve(dir, file));
      }
    }
  }
  return release;
};

module.exports = checkMirai;
