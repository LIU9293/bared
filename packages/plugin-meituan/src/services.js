const axios = require('axios')

module.exports = {
  async fetchMeituanAccessToken(ctx, { meituanAppId }) {
    const meituanApp = await ctx.queries.get('meituan_app', { id: meituanAppId })
  }
}