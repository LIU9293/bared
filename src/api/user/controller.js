const { createJwtToken } = require('./utils/jwt')

module.exports = {
  async loginTest (ctx) {
    const { id } = ctx.request.body
    const user = await bared.services.get('user', { id })

    if (!user) {
      return ctx.throw(404, 'user not found')
    }

    const jwt = createJwtToken(user.id)
    ctx.body = { user, jwt }
  }
}
