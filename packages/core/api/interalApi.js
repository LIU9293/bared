const Router = require('@koa/router')
const allowDeveloper = require('./user/middlewares/allowDeveloper')

const registerSchemaApi = (app, schemas) => {
  const schemaRouter = new Router()
  schemaRouter.use(allowDeveloper)
  schemaRouter.get('/dapi/schema/all', ctx => {
    ctx.body = schemas
  })

  app.use(schemaRouter.routes())
  app.use(schemaRouter.allowedMethods())
}

const registerServicesApi = (app, services) => {
  const serviceRouter = new Router()
  serviceRouter.use(allowDeveloper)
  serviceRouter.get('/dapi/service/all', ctx => {
    ctx.body = JSON.stringify(services)
  })

  app.use(serviceRouter.routes())
  app.use(serviceRouter.allowedMethods())

  const callServicesRouter = new Router()
  callServicesRouter.use(allowDeveloper)

  services.forEach(s => {
    const { name, params, service } = s
    if (process.env.IS_DEV) {
      console.log(`registing internal api: post - /dapi/service/${name.toLowerCase()}`)
    }
    callServicesRouter.post(`/dapi/service/${name.toLowerCase()}`, async ctx => {
      const result = await service(ctx, ctx.request.body)
      ctx.body = result
    })
  })

  app.use(callServicesRouter.routes())
  app.use(callServicesRouter.allowedMethods())
}

module.exports = {
  registerSchemaApi,
  registerServicesApi
}
