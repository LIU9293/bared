const Koa = require('koa')
const glob = require('glob')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const { getAuthType } = require('./api/user/middlewares')

async function start () {
  global.bared = {}
  const app = new Koa()

  const schemas = glob.sync('./**/*.schema.js').map(addr => {
    return require(path.resolve(addr))
  })

  global.bared.schemas = schemas
  global.bared.app = app

  const registerServices = require('./service')
  registerServices()

  const { registerDatabase } = require('./db')
  app.use(bodyParser())
  app.use(getAuthType)

  const pingApi = require('./api/ping')
  app.use(pingApi.routes())
  app.use(pingApi.allowedMethods())

  const dapi = require('./api/dapi')
  app.use(dapi.routes())
  app.use(dapi.allowedMethods())

  const userApi = require('./api/user')
  app.use(userApi.routes())
  app.use(userApi.allowedMethods())

  const registerRoutes = require('./api/register')
  registerRoutes(app)

  await registerDatabase()

  const rootUser = await global.bared.services.get('user', { name: 'admin' })

  if (!rootUser) {
    await global.bared.services.create('user', {
      name: 'admin',
      avatar: 'admin.png',
      age: 18,
      auth_type: 'developer'
    })
  }

  const port = process.env.PORT || 3000
  const _server = app.listen(port)
  global.bared._server = _server
  console.log(`> server listening on port ${port}`)
}

async function stop () {
  await global.bared._server.close()
  global.bared = null
}

module.exports = { start, stop }
