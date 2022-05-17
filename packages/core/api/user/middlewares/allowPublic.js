const allowPublic = async (ctx, next) => {
  if (ctx.state.authType === 'public') {
    await next()
  } else {
    ctx.status = 403
    ctx.body = 'not allowed'
  }
}

module.exports = allowPublic
