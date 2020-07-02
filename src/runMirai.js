const { spawn } = require('child_process');

const runMirai = async (jar, cmds = []) => {
  const mirai = spawn(`java`, [`-Dfile.encoding=UTF-8`, `-jar`, jar, `--update`, `KEEP`]);
  mirai.stdout.on(`data`, data => {
    data = data.toString().trim();
    console.log(data);
    if ((data.includes(`Mirai-console 启动完成`))) {
      for (let cmd of cmds) {
        mirai.stdin.write(`${cmd}\n`);
      }
    }
  });
  mirai.stderr.on(`data`, data => {
    console.error(`[Error]`, data.toString())
  });
  return mirai;
};

module.exports = runMirai;
