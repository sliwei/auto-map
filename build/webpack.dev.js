const merge = require('webpack-merge');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const common = require('./webpack.base.js');
const utils = require('./utils');
const opt = utils.config('dev');
const defPort = 8080;

const devWebpackConfig = merge(common, {
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: { rewrites: { from: /.*/, to: '/index.html' } },
    hot: true,
    contentBase: false,
    compress: true,
    host: '0.0.0.0',
    port: defPort,
    open: false,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    proxy: {
      '/blog': { // 运营
        target: 'https://api.bstu.cn',
        changeOrigin: true,
        pathRewrite: {
          // '/dev': '/'
        }
      },
    },
    quiet: true,
    watchOptions: { poll: false },
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'less-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              name: 'img/[name].[ext]',
              // publicPath: '../'
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 打包配置
    new webpack.DefinePlugin({
      ...opt.URL_LIST,
    }),
  ],
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = defPort;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      let host = devWebpackConfig.devServer.host;
      host = host === '0.0.0.0' ? 'localhost' : host;
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${host}:${port}`],
          },
          onErrors: undefined,
        }),
      );
      resolve(devWebpackConfig);
    }
  });
});
