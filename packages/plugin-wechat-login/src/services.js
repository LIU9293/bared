const axios = require('axios')
const R = require('ramda')
const WEXIN_API_BASE_URL = 'https://api.weixin.qq.com'

module.exports = {
  async registerOrLogin (ctx, {
    code,
    appId,
    appSecret
  }) {
    const url = `${WEXIN_API_BASE_URL}/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    const res = await axios.get(url)
    const { openid, unionid = '', session_key } = res.data // eslint-disable-line
    const user = await ctx.queries.get('user', { openid })

    if (user) {
      setTimeout(async () => {
        await ctx.queries.update('user', { id: user.id }, { wechatSessionKey: session_key }) // eslint-disable-line
      })
      const jwt = ctx.utils.createJwtToken(user.id)
      return { user, jwt }
    } else {
      const newUser = await ctx.queries.create('user', {
        auth_type: 'basic',
        name: 'wechat_user',
        wechatAppid: appId,
        wechatOpenid: openid,
        wechatUnionid: unionid,
        wechatSessionKey: session_key // eslint-disable-line
      })
      const jwt = ctx.utils.createJwtToken(newUser.id)
      return { user: newUser, jwt }
    }
  },

  async updateUserInfo (ctx) {
    const { user } = ctx.state
    const { field, value } = ctx.request.body
    const allowedFields = ['name', 'avatar', 'gender', 'description']

    if (allowedFields.includes(field)) {
      return ctx.badRequest(`update field not allowed, allowed keys are ${allowedFields.concat(',')}`)
    }

    const updatedUser = await ctx.queries.update('user', { id: user.id }, { field: value })
    return updatedUser
  }
}
