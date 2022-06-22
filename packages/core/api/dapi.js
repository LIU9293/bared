const Router = require('@koa/router')
const { allowDeveloper } = require('./user/middlewares')

const getListController = async (ctx, schema) => {
  const { tableName } = schema
  const query = ctx.request.query
  const res = await ctx.queries.getList(tableName, query, { allowPrivate: true })
  ctx.body = res
}

const countController = async (ctx, schema) => {
  const { tableName } = schema
  const query = ctx.request.query
  const res = await ctx.queries.count(tableName, query)
  ctx.body = { count: res }
}

const getController = async (ctx, schema) => {
  const { tableName } = schema
  const id = ctx.params.id
  const res = await ctx.queries.get(tableName, { id }, { allowPrivate: true })
  ctx.body = res
}

const postController = async (ctx, schema) => {
  const { tableName } = schema
  const res = await ctx.queries.create(tableName, ctx.request.body, { allowPrivate: true })
  ctx.body = res
}

const putController = async (ctx, schema) => {
  const { tableName } = schema
  const { id } = ctx.request.params
  const res = await ctx.queries.update(tableName, { id }, ctx.request.body, { allowPrivate: true })
  ctx.body = res
}

const deleteController = async (ctx, schema) => {
  const { tableName } = schema
  const id = ctx.params.id
  const res = await ctx.queries.delete(tableName, { id })
  ctx.body = { id: res }
}

const registerDapi = (app, schemas) => {
  const router = new Router()
  router.use(allowDeveloper)

  schemas.forEach(schema => {
    const { tableName } = schema
    router.get(`/dapi/${tableName}`, ctx => getListController(ctx, schema))
    router.get(`/dapi/${tableName}/count`, ctx => countController(ctx, schema))
    router.get(`/dapi/${tableName}/:id`, ctx => getController(ctx, schema))
    router.post(`/dapi/${tableName}`, ctx => postController(ctx, schema))
    router.delete(`/dapi/${tableName}/:id`, ctx => deleteController(ctx, schema))
    router.put(`/dapi/${tableName}/:id`, ctx => putController(ctx, schema))
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}

module.exports = registerDapi
