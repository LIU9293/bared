const wechatMerchantSchema = require('./wechatMerchantSchema')
const wechatPayOrderSchema = require('./wechatPayOrderSchema')
const wechatMerchantSpSchema = require('./wechatMerchantSpSchema')
const {
  getPayInstance,
  getPaymentParams,
  decodePaymentResource,
  decodePaymentResource3d
} = require('./services')
const routes = require('./router')

module.exports = () => {
  return {
    pluginName: 'wechat-pay',
    extendUserSchema: schema => schema,
    schemas: [
      wechatMerchantSchema,
      wechatPayOrderSchema,
      wechatMerchantSpSchema
    ],

    routers: [
      {
        name: 'WechatPayment',
        routes
      }
    ],
    middlewares: [],
    services: [
      {
        name: 'getPayInstance',
        service: getPayInstance,
        params: {
          merchantId: 'integer'
        }
      },
      {
        name: 'getPaymentParams',
        service: getPaymentParams,
        params: {
          merchantId: 'integer',
          description: 'string',
          amount: 'integer',
          callbackServiceJson: 'string'
        }
      },
      {
        name: 'decodePaymentResource',
        service: decodePaymentResource,
        params: {
          resource: 'string'
        }
      },
      {
        name: 'decodePaymentResource3d',
        service: decodePaymentResource3d,
        params: {
          resource: 'string',
          merchantSpId: 'integer'
        }
      }
    ]
  }
}
