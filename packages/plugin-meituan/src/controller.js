const axios = require('axios')
const qs = require('qs')

module.exports = {
  async authCallback (ctx) {
    const code = ctx.query.auth_code

    console.log('=== dianping auth callback ===')
    console.log(JSON.stringify(ctx.query))

    if (!code) {
      return ctx.badRequest('missing auth_code')
    }

    const str = qs.encode({
      app_key: '7e87366594ca0450',
      app_secret: '2af57b040bc83da633017f0a79f43cf59479c14c',
      grant_type: 'authorization_code',
      auth_code: code,
      redirect_url: 'https://api2.mogroom.com/api/meituan/auth'
    })

    const result = await axios.get(`https://openapi.dianping.com/router/oauth/token?${str}`)
    if (result.data.code && result.data.code === 200) {
      const meituanApp = await ctx.queries.upsert('meituan_app', { bid: result.data.bid }, {
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
        bid: result.data.bid,
        refreshCount: result.data.remain_refresh_count,
        lastUpdateTime: new Date().getTime() / 1000,
        expireIn: result.data.expires_in
      })

      const shops = await ctx.services.meituanFetchShops(ctx, { meituanAppId: meituanApp.id })
      for (const shop of shops) {
        await ctx.services.meituanFetchCoupons(ctx, { meituanShopId: shop.id })
      }

      return ctx.send(`
        <div style="text-align: center; padding-top: 50px">
          <h1>MOGHUB授权成功</h1>
          <h3>请关闭此页面</h3>
        </div>
      `)
    } else {
      throw result.data
    }
  }
}
