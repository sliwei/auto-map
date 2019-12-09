const path = require('path');
const chalk = require('chalk');

/**
 * 返回打包环境配置
 * @returns {any}
 */
exports.config = (name) => {
  let argv = process.argv;
  let env = name || argv[argv.length - 1];
  console.log(chalk.green(`${env} \n`));
  // 如果不携带参数且build则默认prod生产环境
  if (['dev', 'beta', 'prod'].indexOf(env) < 0) {
    env = 'prod';
  }
  return require(path.resolve(__dirname, '../config/' + env + '.env'));
};
