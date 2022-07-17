const axios = require('axios')
const qs = require('qs')

module.exports = {
  async authCallback (ctx) {
    const code = ctx.query.auth_code
    const meituanAppId = ctx.params.meituanAppId
    const meituanApp = await ctx.queries.get('meituan_app', { id: meituanAppId })

    const str = qs.encode({
      app_key: meituanApp.appKey,
      app_secret: meituanApp.appSecret,
      grant_type: 'authorization_code',
      auth_code: code,
      redirect_url: `${process.env.BASE_URL}/api/meituan/auth/callback/${meituanAppId}`
    })

    const result = await axios.get(`https://openapi.dianping.com/router/oauth/token?${str}`)
    if (result.data.code && result.data.code === 200) {
      await ctx.queries.update('meituan_app', { id: meituanAppId }, {
        accessToken: result.data.access_token, // eslint-disable-line
        refreshToken: result.data.refresh_token, // eslint-disable-line
        bid: result.data.bid,
        refreshCount: result.data.remain_refresh_count,
        lastUpdateTime: new Date().getTime() / 1000,
        expireIn: result.data.expires_in
      })
      return ctx.send('授权成功')
    } else {
      console.log('getSessionByAuthCode failed')
      throw result.data
    }
  }
}
