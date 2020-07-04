const { spawn } = require(`child_process`);

const runProject = async (p) => {
  const pro = spawn(`node`, [p]);
  pro.on(`error`, err => {
    console.error(`运行项目发生错误`);
  });
  pro.stdout.on(`data`, data => {
    console.log(`[Project]`, data.toString().trim());
  });
  pro.stderr.on(`data`, data => {
    console.error(`[Error][Project]`, data.toString().trim());
  });
  return pro;
};

module.exports = runProject;
