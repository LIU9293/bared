const Router = require('@koa/router')
const router = new Router()
const { allowPublic } = require('./user/middlewares')

router.use(allowPublic)
router.get(
  '/ping',
  ctx => { ctx.body = 'pong' }
)

module.exports = router
