/* eslint-disable camelcase */
module.exports = {
  async paymentCallback3d (ctx) {
    const { resource } = ctx.request.body
    const result = await ctx.services.decodePaymentResource(ctx, {
      resource,
      merchantSpId: 1 // how to get the corspoding merchant???
    })
    const { out_trade_no, transaction_id, bank_type } = result

    const payOrder = await ctx.queries.update('wechat_pay_order', { orderId: out_trade_no }, {
      txid: transaction_id,
      bank: bank_type,
      success: true
    })

    const { callbackServiceJson } = payOrder
    const { service, params } = typeof callbackServiceJson === 'string' ? JSON.parse(callbackServiceJson) : callbackServiceJson

    try {
      await ctx.services[service](ctx, params)
    } catch (error) {
      console.log('=== wechat pay callback error ===')
      console.log(error)
    }

    ctx.send('ok')
  },

  async paymentCallback (ctx) {
    const { resource } = ctx.request.body
    const { merchantId } = ctx.params
    const result = await ctx.services.decodePaymentResourceDirect(ctx, {
      resource,
      merchantId: parseInt(merchantId)
    })
    const { out_trade_no, transaction_id, bank_type } = result

    const payOrder = await ctx.queries.update('wechat_pay_order', { orderId: out_trade_no }, {
      txid: transaction_id,
      bank: bank_type,
      success: true
    })

    const { callbackServiceJson } = payOrder
    const { service, params } = typeof callbackServiceJson === 'string' ? JSON.parse(callbackServiceJson) : callbackServiceJson

    try {
      await ctx.services[service](ctx, params)
    } catch (error) {
      console.log('=== wechat pay callback error ===')
      console.log(error)
    }

    ctx.send('ok')
  }
}
