const glob = require('glob')
const path = require('path')
const Router = require('@koa/router')

function registerRoutes (app) {
  const routers = glob.sync('./**/*.router.js').map(addr => {
    return require(path.resolve(addr))
  })

  routers.forEach(contentRoutes => {
    const router = new Router()

    contentRoutes.forEach(r => {
      console.log(`> registing route: ${(r.public ? '/api' : '/papi') + r.url}`)
      switch (r.method.toLowerCase()) {
        case 'get':
          router.get(
            (r.public ? '/api' : '/papi') + r.url,
            r.controller)
          break
        case 'post':
          router.post(
            (r.public ? '/api' : '/papi') + r.url,
            r.controller)
          break
        case 'put':
          router.put(
            (r.public ? '/api' : '/papi') + r.url,
            r.controller)
          break
        case 'delete':
          router.delete(
            (r.public ? '/api' : '/papi') + r.url,
            r.controller)
          break
        default:
          break
      }
    })

    app.use(router.routes())
    app.use(router.allowedMethods())
  })
}

module.exports = registerRoutes
