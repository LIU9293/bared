const wechatMerchantSchema = require('./wechatMerchantSchema')
const wechatPayOrderSchema = require('./wechatPayOrderSchema')
const {
  getPaymentParams
} =  require('./services')

module.exports = () => {
  return {
    extendUserSchema: schema => {
      return {
        ...schema
      }
    },
    schemas: [
      wechatMerchantSchema,
      wechatPayOrderSchema
    ],
    routers: [],
    middlewares: [],
    services: [
      {
        name: 'getPaymentParams',
        service: getPaymentParams,
        params: {
          description: 'string',
          amount: 'integer',
          callbackServiceJson: 'string'
        }
      }
    ]
  }
}
