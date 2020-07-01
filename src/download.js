const fs = require('fs');
const axios = require('axios');

const download = (url, dist, method = 'GET') => new Promise((resolve, reject) => {
  axios({
    method,
    url,
    responseType: 'stream',
  }).then(({ data }) => {
    const stream = fs.createWriteStream(dist);
    data.pipe(stream)
    .on('end', () => resolve(dist))
    .on('error', (err) => reject(err));
  });
});

module.exports = download;
