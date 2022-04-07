const { decodeJwtToken } = require('../utils/jwt')

const getAuthType = async (ctx, next) => {
  const { authorization } = ctx.request.header

  if (!authorization) {
    ctx.state.authType = 'public'
    return next()
  }

  const parts = authorization.split(/\s+/)
  if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
    ctx.state.authType = 'public'
    return next()
  }

  const token = parts[1]
  const { payload, isValid } = decodeJwtToken(token)

  if (!isValid) {
    ctx.throw(302, 'neet login')
  }

  const user = await bared.services.get('user', { id: payload.id })
  if (!user) {
    ctx.throw(400, 'user not exist')
  }

  ctx.state.authType = user.auth_type
  ctx.state.user = user
  await next()
}

module.exports = getAuthType
