const allowBasic = async (ctx, next) => {
  console.log(ctx.state.authType)
  if (ctx.state.authType === 'basic') {
    await next()
  } else {
    ctx.status = 403
    ctx.body = 'not allowed'
  }
}

module.exports = allowBasic
