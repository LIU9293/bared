// credit: koa-respond -> https://github.com/jeffijoe/koa-respond
const isString = require('is-string')
const NO_CONTENT = 204

function makeRespond (opts) {
  opts = Object.assign({ autoMessage: false }, opts)
  return function respond (ctx, status, payload) {
    ctx.status = status
    if (status === NO_CONTENT) {
      ctx.body = null
      return ctx
    }

    if (payload === undefined) {
      return ctx
    }

    if (opts.autoMessage && isString(payload)) {
      payload = {
        message: payload
      }
    }

    if (ctx.status >= 400) {
      try {
        setTimeout(async () => {
          const request = JSON.parse(JSON.stringify(ctx.request))
          const query = {
            code: ctx.status,
            url: ctx.request.url,
            method: ctx.request.method.toUpperCase(),
            message: payload,
            error_trace: '',
            raw_request: JSON.stringify({ ...request, body: ctx.request.body })
          }

          if (ctx.state.user) {
            query.user_id = ctx.state.user.id
          }
          await ctx.queries.create('error', query)
        })
      } catch (error) {
        console.error(error)
      }
    }

    ctx.body = payload
    return ctx
  }
}

const statusCodeMap = {
  ok: 200,
  send: 200,
  json: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  locked: 423,
  tooFast: 429,
  internalServerError: 500,
  notImplemented: 501
}

function makeRespondMiddleware (opts) {
  opts = Object.assign({}, opts)

  // Make the respond function.
  const respond = makeRespond(opts)

  function patch (ctx) {
    const statusMethods = Object.assign({}, opts.statusMethods, statusCodeMap)
    ctx.send = respond.bind(ctx, ctx)

    // Bind status methods.
    for (const method in statusMethods) {
      const code = statusMethods[method]
      ctx[method] = respond.bind(ctx, ctx, code)
    }

    // Bind other methods
    const methods = Object.assign({}, opts.methods)
    for (const method in methods) {
      const fn = methods[method]
      ctx[method] = fn.bind(ctx, ctx)
    }

    return ctx
  }

  function respondMiddleware (ctx, next) {
    patch(ctx)
    return next()
  }

  respondMiddleware.patch = patch
  return respondMiddleware
}

module.exports = makeRespondMiddleware
