const { registerOrLogin } = require('./services')

module.exports = {
  async registerOrLogin (ctx) {
    const { code, appId } = ctx.request.body
    const wechatApp = await ctx.queries.get('wechat_app', { appId })

    if (!wechatApp) {
      return ctx.badRequest(`appId ${appId} is not added in wechat_app`)
    }

    const result = await registerOrLogin(ctx, { code, appId, appSecret: wechatApp.appSecret })
    ctx.ok(result)
  },

  async registerOrLoginNative (ctx) {
    const { user } = ctx.state

    if (!user) {
      return ctx.badRequest('not calling from wx cloud run')
    }

    ctx.ok({ user })
  }
}
