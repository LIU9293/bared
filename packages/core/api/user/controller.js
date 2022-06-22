const bcrypt = require('bcrypt')
const { createJwtToken } = require('./utils/jwt')

module.exports = {
  async loginLocal (ctx) {
    const { username, password } = ctx.request.body
    ctx.assert(username && username.length >= 4, 400, 'username length should greater than 4')
    ctx.assert(password && password.length >= 4, 400, 'password length should greater than 4')

    const user = await ctx.queries.get('user', { username }, { allowPrivate: true })
    if (!user) {
      return ctx.badRequest('username is not found')
    }

    const verified = await bcrypt.compare(password, user.password)
    if (!verified) {
      return ctx.badRequest('username or password is not correct')
    }

    const jwt = createJwtToken(user.id)
    delete user.password
    ctx.ok({ user, jwt })
  },

  async registerLocal (ctx) {
    const { username, password } = ctx.request.body
    ctx.assert(username && username.length >= 4, 400, 'username length should greater than 4')
    ctx.assert(password && password.length >= 4, 400, 'password length should greater than 4')

    const existingUser = await ctx.queries.get('user', { username })
    if (existingUser) {
      return ctx.badRequest('username is taken')
    }

    const user = await ctx.queries.create('user', {
      username,
      password,
      auth_type: 'basic'
    })

    const jwt = createJwtToken(user.id)
    ctx.ok({ user, jwt })
  },

  async getProfile (ctx) {
    const { user } = ctx.state
    ctx.ok(user)
  },

  async updateProfile (ctx) {
    const { avatar, name } = ctx.request.body
    const { id } = ctx.state.user
    const q = {}
    if (avatar) { q.avatar = avatar }
    if (name) { q.name = name }

    const updatedUser = await ctx.queries.update('user', { id }, q)
    ctx.ok(updatedUser)
  }
}
