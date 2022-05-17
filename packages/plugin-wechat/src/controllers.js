const { registerOrLogin } = require('./services')

module.exports = { 
  async registerOrLogin (ctx) {
    const { code } = ctx.request.body
    const result = await registerOrLogin(ctx, { code, appid: '', appsecret: '' })
    ctx.ok(result)
  }
}