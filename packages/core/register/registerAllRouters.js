const Router = require('@koa/router')
const allowDeveloper = require('../api/user/middlewares/allowDeveloper')

function registerAllRouters (app, routers) {
  const r = new Router()
  r.use(allowDeveloper)

  r.get('/dapi/routers/all', async ctx => {
    ctx.body = routers
  })

  app.use(r.routes())
  app.use(r.allowedMethods())
}

module.exports = registerAllRouters
