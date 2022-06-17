module.exports  = {
  async authCallback (ctx) {
    const code = ctx.query.auth_code
    const meituanAppId = ctx.params.appid
    const provider = await strapi.queries.get('meituan_app', { id: meituanAppId })

    const str = qs.encode({
      app_key: provider.appKey,
      app_secret: provider.appSecret,
      grant_type: 'authorization_code',
      auth_code: code,
      redirect_url: `${process.env.BASE_URL || 'https://mogroom.com'}/api/meituan/auth/callback/${meituanAppId}`
    })

    const result = await axios.get(`https://openapi.dianping.com/router/oauth/token?${str}`)
    if (result.data.code && result.data.code === 200) {
      await strapi.queries.update('meituan_app', { id: meituanAppId }, {
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
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