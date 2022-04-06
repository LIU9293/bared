const Router = require('@koa/router')
const router = new Router({ prefix: '/auth' })

const routeList = require('./router')
const controllers = require('./controller')

routeList.forEach(r => {
  if (r.method.toLowerCase() === 'get') {
    router.get(r.url, controllers[r.controller])
  }
  if (r.method.toLowerCase() === 'post') {
    router.post(r.url, controllers[r.controller])
  }
})

module.exports = router
