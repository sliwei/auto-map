const webpack = require('webpack');
const path = require('path');
const os = require('os');
const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  resolve: {
    extensions: ['.js', '.vue', '.ts'],
    alias: {
      vue: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: 'happypack/loader?id=happyBabel',
        // loader: 'babel-loader?cacheDirectory=true',
        //排除node_modules 目录下的文件
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'file/[name].[contenthash:8].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[contenthash:8].[ext]',
        },
      },
      // {
      //   test: /\.ts$/,
      //   exclude: /node_modules/,
      //   enforce: 'pre',
      //   loader: 'tslint-loader'
      // },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
    ],
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
    // 模板
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
    }),
    // 多线程加速处理
    new HappyPack({
      // 用id来标识 happypack处理类文件
      id: 'happyBabel',
      // 如何处理 用法和loader 的配置一样
      loaders: [{ loader: 'babel-loader?cacheDirectory=true' }],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true,
    }),
    // 解决vender后面的hash每次都改变
    new webpack.HashedModuleIdsPlugin(),
    // 复制
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: '',
        ignore: ['.*'],
      },
    ]),
  ],
};
