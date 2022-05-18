const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const R = require('ramda')
const respond = require('./middlewares/respond')
const error = require('./middlewares/error')
const { getAuthType } = require('./api/user/middlewares')

const services = require('./service')
const { createJwtToken } = require('./api/user/utils/jwt')

const registerRouter = require('./register/registerRouter')
const registerDatabase = require('./register/registerDatabase')
const registerSchemas = require('./register/registerSchema')

const userSchema = require('./api/user/user.schema')
const errorSchema = require('./api/error/error.schema')
const userRoutes = require('./api/user/user.router')

const registerDapi = require('./api/dapi')
const registerPing = require('./api/ping')
const registerSchema = require('./api/schema')

async function start ({
  /**
   * databaseConfig will be passed to knex:
   * http://knexjs.org/#Installation-client
   */
  databaseConfig = {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'bared'
    }
  },

  /**
   * Plugins are loaded before user code, to ensure user can access services provided by plugins
   */
  plugins = [],

  /**
   * Database schemas defined by user, need to be merged with internal schemas and plugin schemas
   */
  schemas = [],

  /**
   * Routes defined by user, each router should look like:
   * {
   *   name: 'table',
   *   routes: [
   *     {
   *        method: 'POST',
   *        url: '/timer/delete',
   *        controller: deleteTimer,
   *        public: false,
   *        params: {
   *          timerId: { type: 'integer', required: true }
   *        }
   *     }
   *   ]
   * }
   */
  routers = []
}) {
  /**
   * load necessery koa plugins, should let user pass more config in
   */
  const app = new Koa()
  app.use(bodyParser())
  app.use(cors())
  app.use(error)

  const knex = registerDatabase(databaseConfig)

  // get and merge all schemas and register
  let extendedUserSchema = userSchema
  plugins.forEach(plugin => {
    if (plugin.extendUserSchema) {
      extendedUserSchema = plugin.extendUserSchema(extendedUserSchema)
    }
  })

  const allSchemas = R.flatten([
    extendedUserSchema,
    errorSchema,
    ...[schemas],
    ...plugins.map(i => i.schemas)
  ])

  registerSchemas(knex, allSchemas)

  // register services in ctx
  const baredServices = { ...services }
  app.use(async (ctx, next) => {
    for (const i in services) {
      baredServices[i] = services[i](allSchemas, knex)
    }

    ctx.services = baredServices
    ctx.schemas = allSchemas
    ctx.knex = knex
    ctx.utils = { createJwtToken }
    await next()
  })

  app.use(respond())
  app.use(getAuthType)

  // register internal APIs
  registerPing(app)
  registerDapi(app, allSchemas)
  registerSchema(app, allSchemas)

  
  // register user router and plugin routers
  plugins.forEach(plugin => {
    if (plugin.middlewares && plugin.middlewares.length > 0) {
      plugin.middlewares.forEach(middleware => {
        app.use(middleware())
      })
    }

    if (plugin.routers) {
      plugin.routers.forEach(router => registerRouter({ app, ...router }))
    }
  })
  registerRouter({ app, name: 'user', routes: userRoutes })

  routers.forEach(router => {
    registerRouter({ app, ...router })
  })

  const rootUser = await services.get(allSchemas, knex)('user', { name: 'admin' })
  if (!rootUser) {
    // hack here
    await services.create(allSchemas, knex)('user', {
      name: 'admin',
      avatar: 'https://avatars.githubusercontent.com/u/101969885?v=4',
      username: 'root',
      password: 'root',
      auth_type: 'developer'
    })
  }

  app.listen(process.env.PORT || 9293)
  console.log(`> server listening on port ${process.env.PORT || 9293}`)
}

module.exports = start
