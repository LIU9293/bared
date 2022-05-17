const Router = require('@koa/router')
const allowDeveloper = require('./user/middlewares/allowDeveloper')

const registerSchema = (app, schemas) => {
  const schemaRouter = new Router()
  schemaRouter.use(allowDeveloper)
  schemaRouter.get('/dapi/schema/all', ctx => {
    ctx.body = schemas
  })

  app.use(schemaRouter.routes())
  app.use(schemaRouter.allowedMethods())
}

module.exports = registerSchema
