const crypto = require('crypto')
const axios = require('axios')

async function request ({ intent, data = {}, method = 'POST', accessToken, appId, keyId, appKey }) {
  const ts = Math.round(new Date().getTime())
  const str = accessToken
    ? `Accesstoken=${accessToken}&Appid=${appId}&Keyid=${keyId}&Nonce=${ts}&time=${ts}${appKey}`.toLowerCase()
    : `Appid=${appId}&Keyid=${keyId}&Nonce=${ts}&time=${ts}${appKey}`.toLowerCase()

  const sign = crypto.createHash('md5').update(str).digest('hex')

  const headers = {
    Appid: appId,
    Keyid: keyId,
    Nonce: ts,
    Sign: sign,
    Time: ts,
    'Content-Type': 'application/json'
  }

  if (accessToken) {
    headers.Accesstoken = accessToken
  }

  const res = await axios({
    url: 'https://open-cn.ewelink.com/v3.0/open/api',
    method,
    headers,
    data: { intent, data }
  })

  if (res.data && (res.data.code === 0 || res.data.code === 200)) {
    return res.data.result
  }

  throw new Error('ewelink api error:' + ' ' + (res.data.msgDetails || res.data.message))
}

function getSign ({ appId, appKey, ts }) {
  const buffer = Buffer.from(`${appId}_${ts}`, "utf-8");
  const sign = crypto.createHmac("sha256", appKey).update(buffer).digest("base64");
  return sign
}

module.exports = {
  async ewelinkGenerateAuthUrl (ctx, { ewelinkDeveloperId, id }) {
    const ewelinkDeveloper = await ctx.queries.get('ewelink_developer', { id: ewelinkDeveloperId }, { allowPrivate: true })

    if (!ewelinkDeveloper) {
      throw new Error(`ewelink developer not found for id ${ewelinkDeveloperId}`)
    }

    const ts = new Date().getTime()
    const { appId, appKey } = ewelinkDeveloper
    const sign = getSign({ appId, appKey, ts })
    const requestParams = {
      clientId: appId,
      seq: ts,
      authorization: sign,
      redirectUrl: process.env.BASE_URL + '/api/ewelink_auth',
      grantType: 'authorization_code',
      state: `${ewelinkDeveloperId}_${id}`
    }

    const params = Object.keys(requestParams).map(key => `${key}=${requestParams[key]}`).join('&')
    return { url: `https://c2ccdn.coolkit.cc/oauth/index.html?${params}` }
  },

  async ewelinkAccountAuth (ctx, { code, state }) {
    const ewelinkDeveloperId = state.split('_')[0]
    const id = state.split('_')[1]
    if (!id || !ewelinkDeveloperId) {
      throw new Error('state error')
    }

    const ewelinkDeveloper = await ctx.queries.get('ewelink_developer', { id: ewelinkDeveloperId }, { allowPrivate: true })

    const ts = new Date().getTime()
    const { appId, appKey } = ewelinkDeveloper
    const sign = getSign({ appId, appKey, ts })

    const { data } = await axios({
      url: 'https://cn-apia.coolkit.cn/v2/user/oauth/token',
      method: 'POST',
      headers: {
        Authorization: `${sign}`,
        'Content-Type': 'application/json'
      },
      data: { 
        code,
        redirectUrl: process.env.BASE_URL + '/api/ewelink_auth',
        grantType: 'authorization_code'
      }
    })

    const { accessToken, atExpiredTime, refreshToken, rtExpiredTime } = data
    const ewelinkUser = await ctx.queries.upsert('ewelink_user', { id }, {
      developerId: ewelinkDeveloperId,
      appId: id,
      accessToken,
      atExpiredTime,
      refreshToken,
      rtExpiredTime
    })

    return ewelinkUser
  },

  async ewelinkRefreshToken (ctx, { ewelinkUserId }) {
    const ewelinkUser = await ctx.queries.get('ewelink_user', { id: ewelinkUserId }, { allowPrivate: true })
    const ewelinkDeveloper = await ctx.queries.get('ewelink_developer', { id: ewelinkUser.developerId }, { allowPrivate: true })

    if (!ewelinkUser) {
      throw new Error(`ewelink user not found for id ${ewelinkUserId}`)
    }

    const { appId, appKey, keyId } = ewelinkDeveloper

    const result = await request({
      intent: 'config.auth.refreshToken',
      data: {
        refreshToken: ewelinkUser.refreshToken
      },
      appId,
      appKey,
      keyId
    })

    const { accessToken, openId, refreshToken, expiresIn } = result
    const newewelinkUser = await ctx.queries.upsert('ewelink_user', { openId }, {
      accessToken,
      openId,
      refreshToken,
      expiresIn
    })

    return newewelinkUser
  },

  async ewelinkUpdateDevicesForAccount (ctx, { ewelinkUserId, page = 1 }) {
    const pageSize = 100
    const ewelinkUser = await ctx.queries.get('ewelink_user', { id: ewelinkUserId })
    const { accessToken, developerId, id } = ewelinkUser
    const ewelinkDeveloper = await ctx.queries.get('ewelink_developer', { id: developerId }, { allowPrivate: true })
    const { appId, appKey, keyId } = ewelinkDeveloper

    const { data, totalCount } = await request({
      intent: 'query.device.info',
      data: { pageNum: page, pageSize },
      appId,
      appKey,
      keyId,
      accessToken
    })

    for (const item of data) {
      const { did, deviceName, model, state, positionId, parentDid } = item
      await ctx.queries.upsert('ewelink_device', { did }, {
        ewelinkUserId: id,
        did,
        deviceName,
        model,
        state,
        positionId,
        parentDid
      })
    }

    if (totalCount > page * pageSize) {
      console.log(`device length ${totalCount}, current got ${page * pageSize}, loading next 100`)
      await ctx.services.ewelinkUpdateDevicesForAccount(ctx, { ewelinkUserId, page: page + 1 })
    }

    return { success: true }
  },

  async ewelinkGetSwitchStatus (ctx, { did }) {

  },

  async ewelinkTurnSwitch (ctx, { did, resourceId, on = false }) {

  }
}
