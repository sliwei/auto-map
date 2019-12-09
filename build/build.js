const webpack = require('webpack');
const webpackConfig = require('./webpack.prod');
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora('building for production...');
spinner.start();

webpack(webpackConfig, (err, stats) => {
  spinner.stop();
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false,
  }) + '\n');
  console.log(chalk.cyan('  Build complete.\n'));
});
