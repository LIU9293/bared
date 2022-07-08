const WxPay = require('wechatpay-node-v3')
const { customAlphabet } = require('nanoid')
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 12)

module.exports = {
  /**
   *  1. User code call this service
   *  2. This service generate a order record in database
   *  3. Return payment params for controller to send back to user
   *  4. The user complete the payment, wechat server give us callback
   *  5. In callback, use out_trade_no to find the corresponding order record
   *  6. Update the order record with the payment result
   */
  async getPaymentParams (ctx, {
    description,
    amount,
    callbackServiceJson
  }) {
    const { user } = ctx.state
    const { appId, wechatOpenId } = user

    const merchant = await ctx.queries.get('wechat_merchant', { appId })

    if (!merchant) {
      return ctx.badRequest('merchant not found')
    }

    if (!merchant.useV3Api) {
      return ctx.notImplemented('not implemented')
    }

    const pay = new WxPay({
      appid: appId,
      mchid: merchant.merchantId,
      publicKey: merchant.merchantCert,
      privateKey: merchant.merchantPrivateKey
    })

    const orderId = nanoid()
    const order = await ctx.queries.create('wechat_pay_order', {
      orderId,
      userId: user.id,
      amount,
      merchant: merchant.id,
      success: false,
      callbackServiceJson
    })

    const params = {
      description,
      out_trade_no: order.orderId,
      notify_url: process.env.BASE_URL + '/api/wechat/pay/notify',
      amount: { total: amount },
      payer: { openid: wechatOpenId }
    }
    const result = await pay.transactions_jsapi(params)
    return result
  },

  async getPaymentParamsNative (ctx) {
    ctx.ok('wip')
  }
}
