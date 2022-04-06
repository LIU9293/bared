const allowBasic = async (ctx, next) => {
  if (ctx.state.authType === 'basic') {
    return next()
  }
  ctx.throw(403, 'not allowed')
}

module.exports = allowBasic
