const axios = require('axios')

module.exports = {
  async fetchMeituanAccessToken(ctx, { meituanAppId }) {
    const meituanApp = await ctx.queries.get('meituan_app', { id: meituanAppId })
  },

  async refreshMeituanAccessToken(ctx, { meituanAppId }) {
    return 'wip'
  },

  async verifyCode(ctx, { shopId, code }) {
    return 'wip'
  }
}