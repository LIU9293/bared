const meituanRoutes = require('./router')
const meituanAppSchema = require('./meituanAppSchema')
const meituanShopSchema = require('./meituanShopSchema')

const { getMeituanShopsAndUpdate } = require('./services')

module.exports = () => {
  return {
    pluginName: 'meituan',

    extendUserSchema: schema => schema,

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
    
    services: [
      {
        name: 'getMeituanShopsAndUpdate',
        service: getMeituanShopsAndUpdate,
        params: {
          meituanAppId: 'integer'
        }
      }
    ]
  }
}
