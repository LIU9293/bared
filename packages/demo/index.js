require('dotenv').config()
const Bared = require('../core')
const databaseConfig = require('./src/config')
const timerSchema = require('./src/schema')
const timerRoutes = require('./src/router')

const EmailPlugin = require('../plugin-email/src')

async function startServer () {
  await Bared({
    databaseConfig,
    plugins: [
      EmailPlugin
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
