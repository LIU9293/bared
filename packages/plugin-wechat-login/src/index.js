const extendedUserSchemas = require('./user')
const wechatRoutes = require('./router')
const { wechatUserMiddleware } = require('./middlewares')
const wechatAppSchema = require('./wechatAppSchema')

module.exports = () => {
  return {
    pluginName: 'wechat-login',
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
        name: 'WechatLogin',
        routes: wechatRoutes
      }
    ],

    middlewares: [
      wechatUserMiddleware
    ]
  }
}
