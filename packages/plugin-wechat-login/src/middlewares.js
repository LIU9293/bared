
const wechatUserMiddleware = async (ctx, next) => {
  // cloud run
  // we don't care about request not in cloud run, as it will be handled by core auth middleware
  const openid = ctx.request.headers['X-WX-OPENID'] || ctx.request.headers['x-wx-openid']
  const unionid = ctx.request.headers['X-WX-UNIONID'] || ctx.request.headers['x-wx-unionid']
  const appid = ctx.request.headers['X-WX-APPID'] || ctx.request.headers['x-wx-appid']

  if (openid) {
    const user = await ctx.queries.get('user', { wechatOpenid: openid })
    if (!user) {
      const newUser = await ctx.queries.create('user', {
        auth_type: 'basic',
        name: 'wechat_user',
        wechatAppid: appid,
        wechatOpenid: openid,
        wechatUnionid: unionid || ''
      })

      ctx.state.user = newUser
      ctx.state.authType = 'basic'
    } else {
      ctx.state.user = user
      ctx.state.authType = 'basic'
    }
  }

  await next()
}

const wechatAppInfoMiddleware = async (ctx, next) => {
  const appId = ctx.request.headers.appid ||
    ctx.request.headers.appId ||
    ctx.request.query.appId ||
    ctx.request.query.appid
  
  if (appId) {
    const app = await ctx.queries.get('wechat_app', { appId })
    ctx.state.app = app
  }
  
  await next()
}

module.exports = {
  wechatUserMiddleware,
  wechatAppInfoMiddleware
}
