const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const R = require('ramda')
const respond = require('./middlewares/respond')
const error = require('./middlewares/error')
const { getAuthType } = require('./api/user/middlewares')

const queries = require('./service')
const { createJwtToken } = require('./api/user/utils/jwt')

const registerRouter = require('./register/registerRouter')
const registerDatabase = require('./register/registerDatabase')
const registerSchemas = require('./register/registerSchema')
const registerAllRouters = require('./register/registerAllRouters')

const userSchema = require('./api/user/user.schema')
const errorSchema = require('./api/error/error.schema')
const userRoutes = require('./api/user/user.router')

const registerDapi = require('./api/dapi')
const registerPing = require('./api/ping')
const {
  registerSchemaApi,
  registerServicesApi
} = require('./api/interalApi')

async function start ({
  /**
   * databaseConfig will be passed to knex:
   * http://knexjs.org/#Installation-client
   */
  databaseConfig = {},

  /**
   * Plugins are loaded before user code, to ensure user can access services provided by plugins
   */
  plugins = [],

  /**
   * Database schemas defined by user, need to be merged with internal schemas and plugin schemas
   */
  schemas = [],

  /**
   * {
   *   name: 'user',
   *   services: [
   *     {
   *       name,
   *       service,
   *       params
   *     } 
   *   ]
   * }
   */
  services = [],

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
  routers = [],
  
  corsConfig = {},
}) {
  /** *************** basic koa setup *****************/
  const app = new Koa()
  app.use(bodyParser())
  app.use(cors(corsConfig))

  const knex = registerDatabase(databaseConfig)

  /** *************** load all schemas, extend user schemas *****************/
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
    ...plugins.map(i => i.schemas.map(s => ({ ...s, pluginName: i.pluginName })))
  ])

  await registerSchemas(knex, allSchemas)
  /** *************** done load schemas *****************/

  /** *************** register services *****************/
  const pluginServices = R.pipe(
    R.map(i => i.services
      ? i.services.map(j => ({ ...j, pluginName: i.pluginName }))
      : []
    ),
    R.flatten,
    R.filter(i => !!i)
  )(plugins)

  const appServices = R.pipe(
    R.map(i => i.services.map(j => ({ ...j, groupName: i.name }))),
    R.flatten(),
    R.filter(i => !!i)
  )(services)

  app.use(async (ctx, next) => {
    const q = {}
    for (const i in queries) {
      q[i] = queries[i](allSchemas, knex)
    }

    ctx.queries = q
    ctx.services = {}
    pluginServices.forEach(pluginService => {
      const { name, service } = pluginService
      ctx.services[name] = service
    })
    appServices.forEach(appService => {
      const { name, service } = appService
      ctx.services[name] = service
    })

    ctx.schemas = allSchemas
    ctx.knex = knex
    ctx.utils = { createJwtToken }
    await next()
  })

  app.use(error)
  app.use(respond())
  app.use(getAuthType)

  // register internal APIs
  registerPing(app)
  registerDapi(app, allSchemas)
  registerSchemaApi(app, allSchemas)
  registerServicesApi(app, pluginServices.concat(appServices))

  // register user router and plugin routers
  plugins.forEach(plugin => {
    if (plugin.middlewares && plugin.middlewares.length > 0) {
      plugin.middlewares.forEach(middleware => {
        // app.use(middleware())
      })
    }

    if (plugin.routers) {
      /**
       * [{ name: '', routes: '' }]
       */
      plugin.routers.forEach(router => registerRouter({ app, ...router }))
    }
  })

  registerRouter({ app, name: 'User', routes: userRoutes })

  routers.forEach(router => {
    registerRouter({ app, ...router })
  })

  let allPluginRouters = plugins
    .filter(i => i.routers && i.routers.length > 0)
    .map(i => {
      const { routers } = i
      return routers.map(j => ({ ...j, pluginName: i.pluginName }))
    })

  allPluginRouters = R.flatten(allPluginRouters)
  const appRouters = [{ routes: userRoutes, name: 'user' }].concat(routers)

  registerAllRouters(app, allPluginRouters.concat(appRouters))

  const rootUser = await queries.get(allSchemas, knex)('user', { id: 1 })
  if (!rootUser) {
    // hack here
    await queries.create(allSchemas, knex)('user', {
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
