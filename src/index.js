const Koa = require('koa')
const glob = require('glob')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const respond = require('./middlewares/respond')
const error = require('./middlewares/error')
const { getAuthType } = require('./api/user/middlewares')
global.bared = {}

async function start ({ plugins = [] }) {
  const app = new Koa()
  app.use(bodyParser())
  app.use(cors({ origin: _ => '*' }))
  app.use(error)

  const schemas = glob.sync('./**/*.schema.js').map(addr => {
    return require(path.resolve(addr))
  })

  schemas.forEach(schema => {
    if (schema.tableName === 'user') {
      for (const p in plugins) {
        const plugin = plugins[p]
        if (plugin.extendedUserSchemas) {
          schema.attributes = {
            ...schema.attributes,
            ...plugin.extendedUserSchemas
          }
        }
      }
    }
  })

  global.bared.schemas = schemas
  global.bared.app = app

  const registerServices = require('./service')
  registerServices()

  const { registerDatabase } = require('./db')
  app.use(respond())
  app.use(getAuthType)

  const pingApi = require('./api/ping')
  app.use(pingApi.routes())
  app.use(pingApi.allowedMethods())

  const dapi = require('./api/dapi')
  app.use(dapi.routes())
  app.use(dapi.allowedMethods())

  const registerRoutes = require('./api/register')
  registerRoutes(app)

  await registerDatabase()

  const rootUser = await global.bared.services.get('user', { name: 'admin' })

  if (!rootUser) {
    await global.bared.services.create('user', {
      name: 'admin',
      avatar: 'admin.png',
      username: 'root',
      password: 'root',
      auth_type: 'developer'
    })
  }

  const port = process.env.PORT || 3000
  const _server = app.listen(port)
  global.bared._server = _server
  console.log(`> server listening on port ${port}`)
}

module.exports = { start }
