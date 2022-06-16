const extendedUserSchemas = require('./user')
const wechatRoutes = require('./router')
const { wechatUserMiddleware } = require('./middlewares')
const wechatAppSchema = require('./wechatAppSchema')

module.exports = () => {
  return {
    extendUserSchema: schema => {
      return {
        ...schema,
        attributes: {
          ...schema.attributes,
          ...extendedUserSchemas
        }
      }
    },
  
    schemas: [wechatAppSchema],
  
    routers: [
      {
        name: 'wechat_app',
        routes: wechatRoutes
      }
    ],

    middlewares: [
      wechatUserMiddleware
    ]
  }
}
