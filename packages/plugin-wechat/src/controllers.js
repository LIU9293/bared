const { registerOrLogin } = require('./services')

module.exports = { 
  async registerOrLogin (ctx) {
    const { code } = ctx.request.body
    const result = await registerOrLogin(ctx, { code, appid: '', appsecret: '' })

    // { user, jwt }
    ctx.ok(result)
  },

  async registerOrLoginNative (ctx) {
    const { user } = ctx.state

    if (!user) {
      return ctx.badRequest('not calling from wx')
    }

    ctx.ok({ user })
  }
}