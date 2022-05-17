const extendedUserSchemas = require('./user')
const wechatRoutes = require('./router')

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
    ]  
  }
}
