const meituanRoutes = require('./router')
const meituanAppSchema = require('./meituanAppSchema')
const meituanShopSchema = require('./meituanShopSchema')

const {
  meituanFetchShops,
  meituanGetTokenValidTime,
  meituanRefreshToken,
  meituanGetCouponInfo,
  meituanVerifyCode
} = require('./services')

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
        name: 'Meituan',
        routes: meituanRoutes
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
      },
      {
        name: 'meituanGetCouponInfo',
        service: meituanGetCouponInfo,
        params: {
          meituanShopId: 'integer',
          code: 'string'
        }
      },
      {
        name: 'meituanVerifyCode',
        service: meituanVerifyCode,
        params: {
          meituanShopId: 'integer',
          code: 'string',
          count: 'integer'
        }
      }
    ]
  }
}
