const wechatMerchantSchema = require('./wechatMerchantSchema')
const wechatPayOrderSchema = require('./wechatPayOrderSchema')
const wechatMerchantSpSchema = require('./wechatMerchantSpSchema')
const {
  getPaymentParams,
  decodePaymentResource
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
          resource: 'string',
          merchantSpId: 'integer'
        }
      }
    ]
  }
}
