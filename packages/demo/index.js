require('dotenv').config()
const Bared = require('../core')
const databaseConfig = require('./src/config')

const EmailPlugin = require('../plugin-email/src')
const WechatPlugin = require('../plugin-wechat-login/src')
const WechatPayPlugin = require('../plugin-wechat-pay/src')

async function startServer () {
  await Bared({
    databaseConfig,
    plugins: [
      EmailPlugin(),
      WechatPlugin(),
      WechatPayPlugin()
    ],
    schemas: [],
    routers: []
  })
}

startServer()
