const glob = require('glob')
const path = require('path')
const Router = require('@koa/router')
const allowBasic = require('./user/middlewares/allowBasic')
const allowPublic = require('./user/middlewares/allowPublic')
const allowDeveloper = require('./user/middlewares/allowDeveloper')

function registerRoutes (app) {
  const routers = glob.sync('./**/*.router.js').map(addr => {
    const addrArray = addr.split('/')
    const fileName = addrArray[addrArray.length - 1].replace('.router.js', '')

    return {
      routes: require(path.resolve(addr)),
      name: fileName
    }
  })

  const schemaRouter = new Router()
  schemaRouter.use(allowDeveloper)
  schemaRouter.get('/dapi/schema/all', ctx => {
    ctx.body = bared.schemas
  })

  routers.forEach(current => {
    const contentRoutes = current.routes
    const publicRouter = new Router()
    const privateRouter = new Router()
    const developerRouter = new Router()

    privateRouter.use(allowBasic)
    publicRouter.use(allowPublic)
    developerRouter.use(allowDeveloper)

    developerRouter.get(`/dapi/routes/${current.name}`, async ctx => {
      ctx.body = contentRoutes
    })

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
    app.use(developerRouter.routes())
    app.use(developerRouter.allowedMethods())
    app.use(schemaRouter.routes())
    app.use(schemaRouter.allowedMethods())
  })
}

module.exports = registerRoutes
