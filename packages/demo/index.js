require('dotenv').config()
const Bared = require('../core')
const databaseConfig = require('./src/config')
const timerSchema = require('./src/schema')
const timerRoutes = require('./src/router')

const EmailPlugin = require('../plugin-email/src')
const WechatPlugin = require('../plugin-wechat/src')

async function startServer () {
  await Bared({
    databaseConfig,
    plugins: [
      EmailPlugin(),
      WechatPlugin()
    ],
    schemas: [
      timerSchema
    ],
    routers: [
      {
        name: 'timer',
        routes: timerRoutes
      }
    ]
  })
}

startServer()
