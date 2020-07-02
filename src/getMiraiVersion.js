const axios = require('axios');

const versionUrl = `http://api.redbean.tech:64724/Mirai/release`;

const getMiraiVersion = async () => {
  const res = await axios.get(versionUrl);
  const { data } = await axios.get(res.data);
  return data;
};

module.exports = getMiraiVersion;
