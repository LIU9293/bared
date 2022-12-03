const wechatMerchantSchema = require('./wechatMerchantSchema')
const wechatPayOrderSchema = require('./wechatPayOrderSchema')
const wechatMerchantSpSchema = require('./wechatMerchantSpSchema')
const {
  getPayInstance,
  getPaymentParams,
  decodePaymentResource,
  decodePaymentResourceDirect
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
        name: 'decodePaymentResourceDirect',
        service: decodePaymentResourceDirect,
        params: {
          resource: 'string',
          merchantId: 'integer'
        }
      },
      {
        name: 'decodePaymentResource',
        service: decodePaymentResource,
        params: {
          resource: 'string'
        }
      }
    ]
  }
}
