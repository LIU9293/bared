const glob = require('glob')
const path = require('path')
const Router = require('@koa/router')
const allowBasic = require('./user/middlewares/allowBasic')
const allowPublic = require('./user/middlewares/allowPublic')

function registerRoutes (app) {
  const routers = glob.sync('./**/*.router.js').map(addr => {
    return require(path.resolve(addr))
  })

  routers.forEach(contentRoutes => {
    const publicRouter = new Router()
    const privateRouter = new Router()

    privateRouter.use(allowBasic)
    publicRouter.use(allowPublic)

    const publicContentRoutes = contentRoutes.filter(i => i.public)
    const privateContentRoutes = contentRoutes.filter(i => !i.public)

    publicContentRoutes.forEach(r => {
      console.log(`> registing public route: /api${r.url}`)
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
          break
      }
    })

    privateContentRoutes.forEach(r => {
      console.log(`> registing private route: /papi${r.url}`)
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
          break
      }
    })

    app.use(publicRouter.routes())
    app.use(publicRouter.allowedMethods())
    app.use(privateRouter.routes())
    app.use(privateRouter.allowedMethods())
  })
}

module.exports = registerRoutes
