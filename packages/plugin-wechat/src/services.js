const axios = require('axios')
const WEXIN_API_BASE_URL = 'https://api.weixin.qq.com'

module.exports =  {
  async registerOrLogin (ctx, {
    code,
    appid,
    appsecret
  }) {

    const url = `${WEXIN_API_BASE_URL}/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`
    const res = await axios.get(url)
    const { openid, unionid = '', session_key, errcode, errmsg } = res.data

    if (errcode !== 0) {
      throw new Error(errmsg)
    }

    const user = await ctx.services.get('user', { openid })

    if (user) {
      setTimeout(async () => {
        await ctx.services.update('user', { id: user.id }, { sessionKey: session_key })
      })
      const jwt = ctx.utils.createJwtToken(user.id)
      return { user, jwt }
    } else {
      const newUser = {
        auth_type: 'basic',
        name: 'wechat_user',
        openid,
        unionid,
        sessionKey: session_key
      }

      const newUser = await ctx.services.create('user', newUser)
      const jwt = ctx.utils.createJwtToken(newUser.id)
      return { user: newUser, jwt }
    }
  }
}