const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.base.js');
const utils = require('./utils');
const opt = utils.config();
const UploadOss = require('../plugin/UploadOss')

module.exports = merge(common, {
  // 打包模式
  mode: 'production',
  // 输出
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../' + opt.basePath),
    publicPath: opt.baseURI,
  },
  // 取消打包大小警告
  performance: {
    hints: false,
  },
  // 编译器
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' },
          },
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              name: 'img/[name].[contenthash:8].[ext]',
            },
          },
          // 图片压缩
          {
            loader: 'image-webpack-loader',
            options: {
              //   bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    // 打包配置 - 全局变量
    new webpack.DefinePlugin({
      ...opt.URL_LIST,
    }),
    // 打包之前清除文件
    new CleanWebpackPlugin([opt.basePath], {
      root: path.resolve(__dirname, '../'),
    }),
    // 压缩CSS插件
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
    new UploadOss({
      prefix: 'static/auto-map/'
    })
  ],
  // 压缩处理
  optimization: {
    // 分离chunks
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vue: {
          name: 'vue',
          test: module => {
            return /vue|vue-router|vuex/.test(module.context);
          },
          priority: 8,
          chunks: 'all',
        },
        ele: {
          name: 'element-ui',
          test: /element-ui/,
          priority: 10,
          enforce: true,
          chunks: 'all',
        },
        charts: {
          name: 'echarts',
          test: /echarts/,
          priority: 6,
          enforce: true,
          chunks: 'all',
        },
        // 将vue内的样式合并成一个styles
        styles: {
          name: 'styles',
          test: m => m.constructor.name === 'CssModule',
          chunks: 'all',
          minChunks: 1,
          enforce: true,
        },
        // 全部打包成一个vendor
        // vendor: {
        //   name: 'vendor',
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: 10,
        //   chunks: 'initial', // 只打包初始时依赖的第三方
        // },
      },
    },
    minimizer: [
      // 压缩JS代码
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true,
          },
        },
        cache: true,
        parallel: true,
        sourceMap: false, // set to true if you want JS source maps
      }),
      // 压缩CSS代码
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          // 避免 cssnano 重新计算 z-index
          safe: true,
          // cssnano 集成了autoprefixer的功能
          // 会使用到autoprefixer进行无关前缀的清理
          // 关闭autoprefixer功能
          // 使用postcss的autoprefixer功能
          autoprefixer: false,
        },
        canPrint: true,
      }),
    ],
  },
});
