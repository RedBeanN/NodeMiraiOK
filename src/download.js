const fs = require('fs');
const axios = require('axios');

const download = async (url, dist, method = 'GET') => {
  return axios({
    method,
    url,
    responseType: 'stream',
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
  });
};

module.exports = download;
