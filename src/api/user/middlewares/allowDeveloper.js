const allowDeveloper = (ctx, next) => {
  if (ctx.state.authType === 'developer') {
    next()
  } else {
    ctx.throw(403, 'not allowed')
  }
}

module.exports = allowDeveloper
