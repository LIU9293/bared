const bcrypt = require('bcrypt')
const { createJwtToken } = require('./utils/jwt')

module.exports = {
  async loginLocal (ctx) {
    const { username, password } = ctx.request.body
    const user = await bared.services.get('user', { username })
    if (!user) {
      ctx.body = 'username is not found'
      return
    }

    const verified = await bcrypt.compare(password, user.password)
    if (!verified) {
      ctx.body = 'username or password is not correct'
      return
    }

    const jwt = createJwtToken(user.id)
    ctx.body = { user, jwt }
  },

  async registerLocal (ctx) {
    const { username, password } = ctx.request.body

    const existingUser = await bared.services.get('user', { username })
    if (existingUser) {
      ctx.body = 'username is taken'
      return
    }

    const user = await bared.services.create('user', {
      username,
      password,
      auth_type: 'basic'
    })

    const jwt = createJwtToken(user.id)
    ctx.body = { user, jwt }
  },

  async getProfile (ctx) {
    const { user } = ctx.state
    ctx.body = user
  },

  async updateProfile (ctx) {
    const { avatar, name } = ctx.request.body
    const { id } = ctx.state.user
    const q = {}
    if (avatar) {
      q.avatar = avatar
    }
    if (name) {
      q.name = name
    }

    const updatedUser = await bared.services.update('user', id, q)
    ctx.body = updatedUser
  }
}
