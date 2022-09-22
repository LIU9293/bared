const WxPay = require('@bared/wechatpay-node-v3')
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
    merchantId,
    description,
    amount,
    callbackServiceJson // { serviceName: 'completeOrder',  params: { orderId: 1 } }
  }) {
    const { user, app } = ctx.state
    const { wechatOpenId } = user

    const merchant = await ctx.queries.get('wechat_merchant', { id: merchantId })

    if (!merchant) {
      return ctx.badRequest('merchant not found')
    }

    if (!merchant.useV3Api) {
      return ctx.notImplemented('not implemented')
    }

    const orderId = nanoid()
    if (merchant.parentMerchantId) {
      const merchantSp = await ctx.queries.get('wechat_merchant_sp', { id: merchant.parentMerchantId }, { allowPrivate: true })
      const wxpay = new WxPay({
        sp_appid: merchantSp.spAppId,
        sp_mchid: merchantSp.spMchId,
        publicKey: merchantSp.publicKey,
        privateKey: merchantSp.privateKey,
        notify_url: process.env.BASE_URL + '/api/wechat/pay/notify3d',
        serial_no: merchantSp.serialNo
      })

      await ctx.queries.create('wechat_pay_order', {
        orderId,
        userId: user.id,
        amount,
        merchantId: merchant.id,
        success: false,
        callbackServiceJson: JSON.stringify(JSON.parse(callbackServiceJson))
      })

      const result = await wxpay.transactions_jsapi_sp({
        description,
        out_trade_no: orderId,
        sub_appid: app.id,
        sub_mchid: merchant.merchantId,
        amount: {
          total: amount,
          currency: 'CNY'
        },
        payer: { sub_openid: wechatOpenId }
      })

      return result
    }

    const wxpay = new WxPay({
      appid: app.id,
      mchid: merchant.merchantId,
      publicKey: merchant.merchantCert,
      privateKey: merchant.merchantPrivateKey
    })

    const order = await ctx.queries.create('wechat_pay_order', {
      orderId,
      userId: user.id,
      amount,
      merchantId: merchant.id,
      success: false,
      callbackServiceJson: JSON.stringify(JSON.parse(callbackServiceJson))
    })

    const result = await wxpay.transactions_jsapi({
      description,
      out_trade_no: order.orderId,
      notify_url: process.env.BASE_URL + '/api/wechat/pay/notify',
      amount: { total: amount },
      payer: { openid: wechatOpenId }
    })

    return result
  },

  async getPaymentParamsNative (ctx) {
    ctx.ok('wip')
  },

  async decodePaymentResource (ctx, { resource, merchantSpId }) {
    const { spAppId, spMchId, publicKey, privateKey, serialNo, password } = await ctx.queries.get('wechat_merchant_sp', { merchantSpId })
    const wxpay = new WxPay({
      sp_appid: spAppId,
      sp_mchid: spMchId,
      publicKey,
      privateKey,
      notify_url: process.env.BASE_URL + '/api/wechat/pay/notify3d',
      serial_no: serialNo
    })

    const { ciphertext, associated_data, nonce } = resource // eslint-disable-line
    const result = wxpay.decipher_gcm(ciphertext, associated_data, nonce, password)
    return result
  }
}
