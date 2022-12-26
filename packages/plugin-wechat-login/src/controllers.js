const { updateUserInfo } = require('./services')

module.exports = {
  async registerOrLogin (ctx) {
    const { code } = ctx.request.body
    const { app } = ctx.state

    if (!app) {
      return ctx.badRequest('need to specify appId in http header or url query')
    }

    const appWithSecret = await ctx.queries.get('wechat_app', { id: app.id }, { allowPrivate: true })
    const result = await ctx.services.registerOrLogin(ctx, {
      code,
      appId: app.appId,
      appSecret: appWithSecret.appSecret
    })
    ctx.ok(result)
  },

  async registerOrLoginNative (ctx) {
    const { user } = ctx.state

    if (!user) {
      return ctx.badRequest('not calling from wx cloud run')
    }

    ctx.ok({ user })
  },

  async updatePhoneNumberWechat (ctx) {
    const { encryptedData, iv } = ctx.request.body
    const { wechatAppid, id } = ctx.state.user

    const user = await ctx.queries.get('user', { id }, { allowPrivate: true })
    const { wechatSessionKey } = user

    if (!encryptedData || !iv) {
      return ctx.badRequest('iv and encryptedData must be specified')
    }

    const pc = new WXBizDataCrypt(wechatAppid, wechatSessionKey)
    const plainData = pc.decryptData(encryptedData, iv)
    const { purePhoneNumber, countryCode } = plainData

    const res = await ctx.queries.update('user', { id }, {
      phoneNumber: purePhoneNumber,
      countryCode
    })
    return ctx.send(res)
  },

  async updateUserInfo (ctx) {
    const { field, value } = ctx.request.body
    const res = await updateUserInfo(ctx, { field, value })
    return ctx.send(res)
  }
}
