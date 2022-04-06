const allowPublic = (ctx, next) => {
  if (ctx.state.authType === 'public') {
    return next()
  }
  ctx.throw(403, 'not allowed')
}

module.exports = allowPublic
