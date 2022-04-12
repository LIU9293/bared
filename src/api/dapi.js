const Router = require('@koa/router')
const router = new Router()
const { allowDeveloper } = require('./user/middlewares')
router.use(allowDeveloper)

const getListController = schema => async ctx => {
  const { tableName } = schema
  const query = ctx.request.query
  const res = await bared.services.getList(tableName, query)
  ctx.body = res
}

const countController = schema => async ctx => {
  const { tableName } = schema
  const query = ctx.request.query
  const res = await bared.services.count(tableName, query)
  ctx.body = { count: res }
}

const getController = schema => async ctx => {
  const { tableName } = schema
  const id = ctx.params.id
  const res = await bared.services.get(tableName, { id })
  ctx.body = res
}

const postController = schema => async ctx => {
  const { tableName } = schema
  const res = await bared.services.create(tableName, ctx.request.body)
  ctx.body = res
}

const putController = schema => async ctx => {
  const { tableName } = schema
  const { id } = ctx.request.params
  const res = await bared.services.update(tableName, id, ctx.request.body)
  ctx.body = res
}

const deleteController = schema => async ctx => {
  const { tableName } = schema
  const id = ctx.params.id
  const res = await bared.services.delete(tableName, { id })
  ctx.body = { id: res }
}

const { schemas } = global.bared
schemas.forEach(schema => {
  const { tableName } = schema
  router.get(`/dapi/${tableName}`, (ctx, next) => getListController(schema)(ctx, next))
  router.get(`/dapi/${tableName}/count`, (ctx, next) => countController(schema)(ctx, next))
  router.get(`/dapi/${tableName}/:id`, (ctx, next) => getController(schema)(ctx, next))
  router.post(`/dapi/${tableName}`, (ctx, next) => postController(schema)(ctx, next))
  router.delete(`/dapi/${tableName}/:id`, (ctx, next) => deleteController(schema)(ctx, next))
  router.put(`/dapi/${tableName}/:id`, (ctx, next) => putController(schema)(ctx, next))
})

module.exports = router
