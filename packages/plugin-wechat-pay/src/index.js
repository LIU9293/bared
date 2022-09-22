const wechatMerchantSchema = require('./wechatMerchantSchema')
const wechatPayOrderSchema = require('./wechatPayOrderSchema')
const wechatMerchantSpSchema = require('./wechatMerchantSpSchema')
const {
  getPaymentParams,
  decodePaymentResource
} = require('./services')

module.exports = () => {
  return {
    pluginName: 'wechat-pay',
    extendUserSchema: schema => schema,
    schemas: [
      wechatMerchantSchema,
      wechatPayOrderSchema,
      wechatMerchantSpSchema
    ],
    routers: [],
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
