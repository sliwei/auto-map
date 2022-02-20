const path = require('path');
const request = require('request')
const fs = require('fs');

class UploadOss {
  // 七牛SDK mac对象
  // mac = null;

  constructor(options) {
    // 读取传入选项
    this.options = options || {};
    // 检查选项中的参数
    this.checkQiniuConfig();
  }

  checkQiniuConfig() {
    console.log(this.options);
  }

  apply(compiler) {
    compiler.plugin('done', ({compilation}, callback) => {
      const uploadCount = Object.keys(compilation.assets).length;
      // 已上传数量
      let currentUploadedCount = 0;
      // 因为是批量上传，需要在最后将错误对象回调
      let globalError = null;

      // 遍历编译资源文件
      for (const filename of Object.keys(compilation.assets)) {
        const fixname = filename.replace(`./`, '')
        // 开始上传
        console.log(path.resolve(compilation.outputOptions.path, fixname));
        let formData = {
          key: `${this.options.prefix}${fixname}`,
          file: fs.createReadStream(path.resolve(compilation.outputOptions.path, fixname)) // 单个文件形式
        }
        request.post({
          url: "http://0.0.0.0:3005/core/oss/build_upload", formData
        }, function (error, response, body) {
          currentUploadedCount++;
          if (error) {
            globalError = error;
          } else {
            console.log(JSON.parse(body).data.url, '上传成功~')
          }
          if (currentUploadedCount === uploadCount) {
            globalError ? console.log(globalError) : console.log('上传完成！');
          }
        })
      }
    })
  }
}

module.exports = UploadOss;