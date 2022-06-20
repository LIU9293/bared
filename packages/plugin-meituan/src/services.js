const crypto = require('crypto')
const axios = require('axios')

function genMd5 (text) {
  return crypto.createHash('md5').update(text, 'utf-8').digest('hex')
}

function sign (param, appsecret) {
  const lists = []
  let ps = appsecret
  for (const item in param) {
    lists.push(item)
  }
  lists.sort()
  lists.forEach(function (key) {
    ps += key + param[key]
  })
  ps += appsecret
  return genMd5(ps)
}


module.exports = {
  async fetchMeituanAccessToken(ctx, { meituanAppId }) {
    const meituanApp = await ctx.queries.get('meituan_app', { id: meituanAppId })
  },

  async refreshMeituanAccessToken(ctx, { meituanAppId }) {
    return 'wip'
  },

  async verifyCode(ctx, { shopId, code }) {
    return 'wip'
  },

  async getMeituanShopsAndUpdate (ctx, { meituanAppId }) {
    const meituanApp = await ctx.queries.get('meituan_app', { id: meituanAppId })
    const { appKey, accessToken, bid, appSecret } = meituanApp
    const params = {
      app_key: appKey,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      session: accessToken,
      bid,
      format: 'json',
      v: 1,
      sign_method: 'MD5',
      offset: 0,
      limit: 100
    }
    const sig = sign(params, appSecret)
    const str = qs.encode({ ...params, sign: sig })
    const result = await axios.get(`https://openapi.dianping.com/router/oauth/session/scope?${str}`)

    const { data } = result
    return data
  }
}