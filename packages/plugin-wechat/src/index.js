const extendedUserSchemas = require('./user')
const wechatRoutes = require('./router')

module.exports = {
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
  ]
}
