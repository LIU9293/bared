const meituanRoutes = require('./router')
const meituanAppSchema = require('./meituanAppSchema')
const meituanShopSchema = require('./meituanShopSchema')

module.exports = () => {
  return {
    extendUserSchema: schema => {
      return {
        ...schema
      }
    },
    schemas: [
      meituanAppSchema,
      meituanShopSchema
    ],
    routers: [
      {
        name: 'meituan_app',
        routers: meituanRoutes
      }
    ],
    middlewares: [],
    services: []
  }
}
