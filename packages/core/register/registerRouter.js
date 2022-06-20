const Router = require('@koa/router')
const allowBasic = require('../api/user/middlewares/allowBasic')
const allowPublic = require('../api/user/middlewares/allowPublic')
const allowDeveloper = require('../api/user/middlewares/allowDeveloper')

/**
 * Register router based on @koa/router
 * @param {String} name
 * @param {Array} routes
 */
const registerRouter = ({ app, name = '', routes = [] }) => {
  // initalize new router
  const publicRouter = new Router()
  const privateRouter = new Router()
  const developerRouter = new Router()

  publicRouter.use(allowPublic)
  privateRouter.use(allowBasic)
  developerRouter.use(allowDeveloper)

  const publicContentRoutes = routes.filter(i => i.public)
  const privateContentRoutes = routes.filter(i => !i.public)

  developerRouter.get(`/dapi/routes/${name}`, async ctx => {
    ctx.body = routes
  })

  app.use(developerRouter.routes())
  app.use(developerRouter.allowedMethods())

  if (publicContentRoutes && publicContentRoutes.length > 0) {
    publicContentRoutes.forEach(r => {

      if (process.env.IS_DEV) {
        console.log(`registering public ${r.method} route: /api${r.url}`)
      }
      switch (r.method.toLowerCase()) {
        case 'get':
          publicRouter.get('/api' + r.url, r.controller)
          break
        case 'post':
          publicRouter.post('/api' + r.url, r.controller)
          break
        case 'put':
          publicRouter.put('/api' + r.url, r.controller)
          break
        case 'delete':
          publicRouter.delete('/api' + r.url, r.controller)
          break
        default:
          publicRouter.get('/api' + r.url, r.controller)
          break
      }
    })

    app.use(publicRouter.routes())
    app.use(publicRouter.allowedMethods())
  }

  if (privateContentRoutes && privateContentRoutes.length > 0) {
    privateContentRoutes.forEach(r => {
      if (process.env.IS_DEV) {
        console.log(`registering private ${r.method} route: /papi${r.url}`)
      }
      switch (r.method.toLowerCase()) {
        case 'get':
          privateRouter.get('/papi' + r.url, r.controller)
          break
        case 'post':
          privateRouter.post('/papi' + r.url, r.controller)
          break
        case 'put':
          privateRouter.put('/papi' + r.url, r.controller)
          break
        case 'delete':
          privateRouter.delete('/papi' + r.url, r.controller)
          break
        default:
          privateRouter.get('/papi' + r.url, r.controller)
          break
      }
    })

    app.use(privateRouter.routes())
    app.use(privateRouter.allowedMethods())
  }
}

module.exports = registerRouter
