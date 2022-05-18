const extendedUserSchemas = require('./user')
const wechatRoutes = require('./router')
const { wechatUserMiddleware } = require('./middlewares')

module.exports = config => {
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
  
    schemas: [],
  
    routers: [
      {
        name: 'wechat',
        routes: wechatRoutes
      }
    ],

    middlewares: [
      wechatUserMiddleware
    ]
  }
}
