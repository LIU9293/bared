const Router = require('@koa/router')
const { allowPublic } = require('./user/middlewares')

const registerPing = app => {
  const router = new Router()

  router.use(allowPublic)
  router.get(
    '/ping',
    ctx => {
      ctx.body = 'pong'
    }
  )

  app.use(router.routes())
  app.use(router.allowedMethods())
}

module.exports = registerPing
