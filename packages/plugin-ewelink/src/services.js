const crypto = require('crypto')
const axios = require('axios')
const R = require('ramda')

function toQueryString (obj) {
  return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')
}

async function request ({ url, params = {}, method = 'POST', accessToken, appId }) {
  const requestUrl = method === 'GET' 
    ? `https://apia.coolkit.cn/${url}?${toQueryString(params)}` 
    : `https://apia.coolkit.cn/${url}`

  const { data } = await axios({
    url: requestUrl,
    method,
    headers: {
      Host: 'cn-apia.coolkit.cn',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'x-ck-appid': `${appId}`,
    },
    data: params
  })

  if (!data.error) {
    return data.data
  }

  throw new Error('ewelink api error:' + ' ' + (data?.msg || data))
}

function getAuthLinkSign ({ appId, appKey, ts }) {
  const buffer = Buffer.from(`${appId}_${ts}`, "utf-8")
  const sign = crypto.createHmac("sha256", appKey).update(buffer).digest("base64")
  return sign
}

function getRequestSign ({ params, appKey }) {
  const buffer = Buffer.from(JSON.stringify(params), "utf-8" )
  const sign = crypto.createHmac("sha256", appKey).update(buffer).digest("base64")
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
    const sign = getAuthLinkSign({ appId, appKey, ts })
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

    const params = { 
      code,
      grantType: 'authorization_code',
      redirectUrl: process.env.BASE_URL + '/api/ewelink_auth',
    }
    const sign = getRequestSign({ params, appKey })

    const { data } = await axios({
      url: 'https://cn-apia.coolkit.cn/v2/user/oauth/token',
      method: 'POST',
      headers: {
        Host: 'cn-apia.coolkit.cn',
        Authorization: `Sign ${sign}`,
        'Content-Type': 'application/json',
        'x-ck-appid': `${appId}`,
      },
      data: params
    })

    const { accessToken, atExpiredTime, refreshToken, rtExpiredTime } = data.data
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
    const pageSize = 30
    const ewelinkUser = await ctx.queries.get('ewelink_user', { id: ewelinkUserId })
    
    const { accessToken, developerId, id } = ewelinkUser
    const ewelinkDeveloper = await ctx.queries.get('ewelink_developer', { id: developerId }, { allowPrivate: true })
    const { appId } = ewelinkDeveloper

    // { thingList: [], total: 0 }
    const { thingList, total } = await request({
      url: 'v2/device/thing',
      method: 'GET',
      accessToken,
      appId,
      params: {
        num: 30,
        beginIndex: (page - 1) * 30
      }
    })

    for (const item of thingList) {
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

    if (total > page * 30) {
      console.log(`ewelink device length ${totalCount}, current got ${page * pageSize}, loading next 30`)
      await ctx.services.ewelinkUpdateDevicesForAccount(ctx, { ewelinkUserId, page: page + 1 })
    }

    return { success: true }
  },

  async ewelinkGetSwitchStatus (ctx, { did }) {

  },

  async ewelinkTurnSwitch (ctx, { did, resourceId, on = false }) {

  }
}
