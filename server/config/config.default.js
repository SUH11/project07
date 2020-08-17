/* eslint valid-jsdoc: "off" */

'use strict'

const path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1595939333682_4518'
  
  // 文件上传需要打开
  config.multipart = {
    mode: 'file',
    // whitelist: [
    //   '.jpg', '.jpeg', // image/jpeg
    //   '.png', // image/png, image/x-png
    //   '.gif', // image/gif
    //   '.bmp', // image/bmp
    //   '.wbmp', // image/vnd.wap.wbmp
    //   '.webp',
    //   '.tif',
    //   '.psd',
    //   // text
    //   '.svg',
    //   '.js', '.jsx',
    //   '.json',
    //   '.css', '.less',
    //   '.html', '.htm',
    //   '.xml',
    //   // tar
    //   '.zip',
    //   '.gz', '.tgz', '.gzip',
    //   // video
    //   '.mp3',
    //   '.mp4',
    //   '.avi',
    // ],
    whitelist: () => true,
    fileSize: '500mb',
  }
  

  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false
      }
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/project07',
        options: {}
      }
    },
    jwt: {
      secret: 'suhong'
    }
  }
}
