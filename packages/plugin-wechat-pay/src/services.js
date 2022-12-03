const WxPay = require('@bared/wechatpay-node-v3')
const { customAlphabet } = require('nanoid')
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 12)

module.exports = {
  async getPayInstance (ctx, { merchantId }) {
    const { app } = ctx.state
    const merchant = await ctx.queries.get('wechat_merchant', { id: merchantId }, { allowPrivate: true })

    if (!merchant) {
      throw new Error('merchant not found')
    }

    if (!merchant.useV3Api) {
      throw new Error('not implemented')
    }

    let wxpay
    if (merchant.parentMerchantId) {
      const merchantSp = await ctx.queries.get('wechat_merchant_sp', { id: merchant.parentMerchantId }, { allowPrivate: true })

      wxpay = new WxPay({
        sp_appid: merchantSp.spAppId,
        sp_mchid: merchantSp.spMchId,
        sub_mchid: merchant.merchantId,
        publicKey: merchantSp.publicKey,
        privateKey: merchantSp.privateKey,
        notify_url: process.env.BASE_URL + '/api/wechat/pay/notify3d',
        serial_no: merchantSp.serialNo
      })
    } else {
      wxpay = new WxPay({
        appid: app.appId,
        mchid: merchant.merchantId,
        publicKey: merchant.merchantCert,
        privateKey: merchant.merchantPrivateKey,
        notify_url: process.env.BASE_URL + '/api/wechat/pay/notify/' + merchant.id
      })
    }

    return { payInstance: wxpay, merchant }
  },

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
    const { app } = ctx.state
    const user = await ctx.queries.get('user', { id: ctx.state.user.id }, { allowPrivate: true })
    const { payInstance, merchant } = await ctx.services.getPayInstance(ctx, { merchantId })

    const orderId = nanoid()
    if (merchant.parentMerchantId) {
      const payOrder = await ctx.queries.create('wechat_pay_order', {
        orderId,
        userId: user.id,
        amount,
        merchantId: merchant.id,
        success: false,
        callbackServiceJson: JSON.stringify(callbackServiceJson)
      })

      const result = await payInstance.transactions_jsapi_sp({
        description,
        out_trade_no: orderId,
        sub_appid: app.appId,
        sub_mchid: merchant.merchantId,
        amount: {
          total: amount,
          currency: 'CNY'
        },
        payer: { sub_openid: user.wechatOpenid }
      })

      return { ...result, payOrderId: payOrder.id }
    }

    const payOrder = await ctx.queries.create('wechat_pay_order', {
      orderId,
      userId: user.id,
      amount,
      merchantId: merchant.id,
      success: false,
      callbackServiceJson: JSON.stringify(callbackServiceJson)
    })

    const result = await payInstance.transactions_jsapi({
      description,
      out_trade_no: orderId,
      amount: { total: amount },
      payer: { openid: user.wechatOpenid }
    })

    return { ...result, payOrderId: payOrder.id }
  },

  async getPaymentParamsNative (ctx) {
    ctx.ok('wip')
  },

  async refundPayment (ctx, { payOrderId, amount }) {
    const payOrder = await ctx.queries.get('wechat_pay_order', { id: payOrderId }, { allowPrivate: true }) // eslint-disable-line

    if (payOrder.refundPayment + amount > payOrder.amount) {
      throw new Error('refund amount exceed original amount')
    }

    const { payInstance } = await ctx.services.getPayInstance(ctx, { merchantId: payOrder.merchantId })
    const result = await payInstance.refunds({
      out_refund_no: nanoid(),
      out_trade_no: payOrder.txid,
      amount,
      sub_mchid: merchant.parentMerchantId ? merchant.merchantId : null
    })

    setTimeout(async () => {
      try {
        await ctx.queries.update('wechat_pay_order', { id: payOrder.id }, {
          refundedAmount: payOrder.refundedAmount + amount
        })
      } catch (error) {
        console.log(error)
      }
    }, 0)
    
    return result
  },

  async decodePaymentResource (ctx, { resource, merchantSpId }) {
    const { spAppId, spMchId, publicKey, privateKey, serialNo, password } = await ctx.queries.get(
      'wechat_merchant_sp', { id: merchantSpId }, { allowPrivate: true })

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
  },

  async decodePaymentResourceDirect (ctx, { resource, merchantId }) {
    const merchant = await ctx.queries.get(
      'wechat_merchant', { id: merchantId }, { allowPrivate: true })
    const app = await ctx.queries.get('app', { merchantId: merchant.id }, { allowPrivate: true })

    const wxpay = new WxPay({
      appid: app.appId,
      mchid: merchant.merchantId,
      publicKey: merchant.merchantCert,
      privateKey: merchant.merchantPrivateKey
    })

    const { ciphertext, associated_data, nonce } = resource // eslint-disable-line
    const result = wxpay.decipher_gcm(ciphertext, associated_data, nonce, merchant.merchantKey)
    return result
  }
}
