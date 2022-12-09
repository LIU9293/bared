
async function errorMiddleware (ctx, next) {
  try {

    await next()

  } catch (error) {
  
    if (process.env.IS_DEV) {
      console.log('===== error middleware =====')
      console.log(error)
    }

    try {
      setTimeout(async () => {
        const request = JSON.parse(JSON.stringify(ctx.request))
        const query = {
          code: error.statusCode || error.status || 500,
          url: ctx.request.url,
          method: ctx.request.method.toUpperCase(),
          message: error.message,
          error_trace: error.stack,
          raw_request: JSON.stringify({ ...request, body: ctx.request.body })
        }

        if (ctx.state.user) {
          query.user_id = ctx.state.user.id
        }
        await ctx.queries.create('error', query)
      })
    } catch (e) {
      console.log('===== error middleware, store error failed =====')
      console.error(e)
    }

    ctx.body = { success: false, message: error.message }
  }
}

module.exports = errorMiddleware
