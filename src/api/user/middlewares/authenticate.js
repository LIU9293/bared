const { decodeJwtToken } = require('../utils/jwt')

const authenticate = async (ctx, next) => {
  const { authorization } = ctx.request.header
  if (!authorization) {
    ctx.state.authType = 'public'
    if (ctx.request.url.indexOf('/api') >= 0 ||
    ctx.request.url.indexOf('/auth') >= 0 ||
    ctx.request.url.indexOf('/ping') >= 0
    ) {
      console.log(`> public user request, url: ${ctx.request.url}`)
      return next()
    } else {
      if (ctx.request.query.TEST_DAPI) {
        return next()
      }

      console.log(`> request not allowed, url: ${ctx.request.url}`)
      ctx.throw(403, 'not allowed')
    }
  }

  const parts = authorization.split(/\s+/)
  if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
    ctx.state.authType = 'public'
  }

  const token = parts[1]
  const { payload, isValid } = decodeJwtToken(token)

  if (!isValid) {
    ctx.throw(403, 'jwt is not valid')
  }

  const user = await bared.services.get('user', { id: payload.id })
  if (!user) {
    ctx.throw(403, 'user is not found')
  }

  console.log(`> authorized user request, id: ${user.id}, auth type: ${user.auth_type}`)
  if (ctx.request.url.indexOf('/dapi') >= 0 && user.auth_type !== 'developer') {
    console.log(`> request not allowed, url: ${ctx.request.url}, user: ${user.id}`)
    ctx.throw(403, 'not allowed')
  }

  ctx.state.user = user
  ctx.state.authType = user.auth_type
  return next()
}

module.exports = authenticate
