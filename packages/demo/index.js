require('dotenv').config()
const databaseConfig = require('./src/config')

const Bared = require('@bared/core')
const EmailPlugin = require('@bared/plugin-email/src')
const WechatLoginPlugin = require('@bared/plugin-wechat-login/src')
const WechatPayPlugin = require('@bared/plugin-wechat-pay/src')
const ttlockPlugin = require('@bared/plugin-ttlock/src')
const aqaraPlugin = require('@bared/plugin-aqara/src')
const aliyunSmsPlugin = require('@bared/plugin-aliyun-sms/src')
const meituanPlugin = require('@bared/plugin-meituan/src')

async function startServer () {
  await Bared({
    databaseConfig,
    plugins: [
      EmailPlugin(),
      WechatLoginPlugin(),
      WechatPayPlugin(),
      ttlockPlugin(),
      aqaraPlugin(),
      aliyunSmsPlugin(),
      meituanPlugin()
    ],
    schemas: [],
    routers: []
  })
}

startServer()
