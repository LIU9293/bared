const allowBasic = async (ctx, next) => {
  if (ctx.state.authType === 'basic' ||
    ctx.state.authType === 'developer'
  ) {
    await next()
  } else {
    ctx.status = 403
    ctx.body = 'not allowed'
  }
}

module.exports = allowBasic
