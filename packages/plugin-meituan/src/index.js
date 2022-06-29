const meituanRoutes = require('./router')
const meituanAppSchema = require('./meituanAppSchema')
const meituanShopSchema = require('./meituanShopSchema')

const { meituanFetchShops, meituanGetTokenValidTime, meituanRefreshToken} = require('./services')

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
        name: 'meituanFetchShops',
        service: meituanFetchShops,
        params: {
          meituanAppId: 'integer'
        }
      },
      {
        name: 'meituanGetTokenValidTime',
        service: meituanGetTokenValidTime,
        params: {
          meituanAppId: 'integer'
        }
      },
      {
        name: 'meituanRefreshToken',
        service: meituanRefreshToken,
        params: {
          meituanAppId: 'integer'
        }
      }
    ]
  }
}
