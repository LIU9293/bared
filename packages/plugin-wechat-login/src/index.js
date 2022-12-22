const extendedUserSchemas = require('./user')
const wechatRoutes = require('./router')
const {
  wechatUserMiddleware,
  wechatAppInfoMiddleware
} = require('./middlewares')
const wechatAppSchema = require('./wechatAppSchema')
const { registerOrLogin, updateUserInfo } = require('./services')
const defaultIdConfig = { length: 6, alphabet: '0123456789abcdefghijklmnopqrstuvwxyz' }

module.exports = ({ shortIdConfig = defaultIdConfig }) => {
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

    services: [
      {
        name: 'registerOrLogin',
        service: async (ctx, params) => await registerOrLogin(ctx, params, shortIdConfig),
        params: {
          code: 'string',
          appId: 'string',
          appSecret: 'string'
        }
      },
      {
        name: 'updateUserInfo',
        service: updateUserInfo
      }
    ],

    routers: [
      {
        name: 'WechatLogin',
        routes: wechatRoutes
      }
    ],

    middlewares: [
      wechatUserMiddleware,
      wechatAppInfoMiddleware
    ]
  }
}
