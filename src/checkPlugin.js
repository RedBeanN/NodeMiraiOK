const fs = require('fs');
const path = require('path');
const axios = require('axios');
const download = require('./download');
const releaseUrl = `http://api.redbean.tech:64724/MiraiPlugins/release`;

const getPluginInfo = async (plugin) => {
  const plugins = (await axios.get(releaseUrl)).data;
  for (let p of plugins) {
    if (p.name === plugin) return p;
  }
  return null;
};

const getCurrentPluginVersion = (rootDir, plugin) => {
  const files = fs.readdirSync(path.resolve(rootDir));
  for (let file of files) {
    if (file.startsWith(plugin)) {
      const group = file.match(/([\d\.]+).jar$/);
      if (group && group[1]) return group[1];
    }
  }
  return '';
};

const downloadPlugin = async (rootDir, info) => {
  const url = info.url;
  const dist = path.resolve(rootDir, `${info.fullName}`);
  return axios({
    method: 'GET',
    url,
    responseType: 'stream',
    headers: {
      Referer: 'https://mirai.redbean.tech/',
      'Content-Type': 'application/java-archive',
    },
  }).then(({ data }) => {
    const stream = fs.createWriteStream(dist);
    return new Promise((resolve, reject) => {
      data.pipe(stream);
      data.on('end', () => {
        resolve(dist);
      });
      data.on('error', (err) => {
        reject(err);
      });
    });
  }).catch(e => console.error(e));
};

const checkPlugin = async (rootDir, plugin) => {
  const info = await getPluginInfo(plugin);
  if (!info) {
    return console.log(`找不到指定的插件`);
  }
  const currentVersion = getCurrentPluginVersion(rootDir, plugin);
  if (info.version === currentVersion) {
    return console.log(`${plugin} 当前已是最新版`);
  }
  console.log(`正在下载 ${info.fullName} ...`);
  await downloadPlugin(rootDir, info);
  return console.log(`${info.fullName} 下载完成`);
};

// getCurrentPluginVersion(process.cwd(), 'mirai-api-http');
module.exports = checkPlugin;
