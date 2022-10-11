const { registerOrLogin } = require('./services')

module.exports = {
  async registerOrLogin (ctx) {
    const { code } = ctx.request.body
    const { app } = ctx.state

    if (!app) {
      return ctx.badRequest('need to specify appId in http header or url query')
    }

    const appWithSecret = await ctx.queries.get('app', { id: app.id }, { allowPrivate: true })
    const result = await registerOrLogin(ctx, {
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
  }
}
