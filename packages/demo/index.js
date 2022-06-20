require('dotenv').config()
const Bared = require('../core')
const databaseConfig = require('./src/config')

const EmailPlugin = require('../plugin-email/src')
const WechatLoginPlugin = require('../plugin-wechat-login/src')
const WechatPayPlugin = require('../plugin-wechat-pay/src')
const ttlockPlugin = require('../plugin-ttlock/src')
const aqaraPlugin = require('../plugin-aqara/src')

async function startServer () {
  await Bared({
    databaseConfig,
    plugins: [
      EmailPlugin(),
      WechatLoginPlugin(),
      WechatPayPlugin(),
      ttlockPlugin(),
      aqaraPlugin()
    ],
    schemas: [],
    routers: []
  })
}

startServer()
