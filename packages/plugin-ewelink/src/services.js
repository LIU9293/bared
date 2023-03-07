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
    console.log('=== ewelink user ===')
    console.log(data.data)
    
    await ctx.queries.upsert('ewelink_user', { id }, {
      developerId: ewelinkDeveloperId,
      appId: id,
      accessToken,
      atExpiredTime,
      refreshToken,
      rtExpiredTime
    })

    return ctx.send(`
      <div style="margin-top: 50px; text-align: center;">
        <h1>MOGHUB授权成功</h1>
        <h3>请关闭页面</h3>
      </div>
    `)
  },

  async ewelinkRefreshToken (ctx, { ewelinkUserId }) {
    const ewelinkUser = await ctx.queries.get('ewelink_user', { id: ewelinkUserId }, { allowPrivate: true })
    const ewelinkDeveloper = await ctx.queries.get('ewelink_developer', { id: ewelinkUser.developerId }, { allowPrivate: true })

    if (!ewelinkUser) {
      throw new Error(`ewelink user not found for id ${ewelinkUserId}`)
    }

    const { appId, appKey } = ewelinkDeveloper
    return { success: false }
  },

  async ewelinkUpdateDevicesForAccount (ctx, { ewelinkUserId, page = 1, totalSize = 0 }) {
    const pageSize = 30
    const ewelinkUser = await ctx.queries.get('ewelink_user', { id: ewelinkUserId })
    const { accessToken, developerId, id } = ewelinkUser
    const ewelinkDeveloper = await ctx.queries.get('ewelink_developer', { id: developerId }, { allowPrivate: true })
    const { appId } = ewelinkDeveloper
    const beginIndex = totalSize ? -(totalSize - pageSize * (page - 1)) : -9999999

    const { thingList, total } = await request({
      url: 'v2/device/thing',
      method: 'GET',
      accessToken,
      appId,
      params: { num: pageSize, beginIndex }
    })

    for (const item of thingList) {
      const { itemType, itemData, index } = item
      await ctx.queries.upsert('ewelink_device', { did: itemData.deviceid }, {
        ewelinkUserId: id,
        deviceName: itemData.name,
        did: itemData.deviceid,
        model: itemData.productModel
      })
    }

    if (total > page * 30) {
      console.log(`ewelink device length ${total}, current got ${page * pageSize}, loading next 30`)
      await ctx.services.ewelinkUpdateDevicesForAccount(ctx, { ewelinkUserId, page: page + 1, totalSize: total })
    }

    return { success: true }
  },

  async ewelinkGetDeviceDetail (ctx, { ewelinkDeviceId }) {
    const info = await ctx.knex('ewelink_device')
      .join('ewelink_user', 'ewelink_device.ewelinkUserId', 'ewelink_user.id')
      .join('ewelink_developer', 'ewelink_user.developerId', 'ewelink_developer.id')
      .select(
        'ewelink_device.did',
        'ewelink_user.accessToken',
        'ewelink_developer.appId')
      .where('ewelink_device.id', ewelinkDeviceId)
      .first()

    const data = await request({
      url: `v2/device/thing/status`,
      method: 'GET',
      accessToken: info.accessToken,
      appId: info.appId,
      params: {
        type: 1,
        id: info.did,
      }
    })

    return { response: data.params }
  },

  async ewelinkTurnSwitch (ctx, { ewelinkDeviceId, index = 0, on }) {
    const info = await ctx.knex('ewelink_device')
      .join('ewelink_user', 'ewelink_device.ewelinkUserId', 'ewelink_user.id')
      .join('ewelink_developer', 'ewelink_user.developerId', 'ewelink_developer.id')
      .select(
        'ewelink_device.did',
        'ewelink_user.accessToken',
        'ewelink_developer.appId')
      .where('ewelink_device.id', ewelinkDeviceId)
      .first()

    const data = await request({
      url: 'v2/device/thing/status',
      method: 'POST',
      accessToken: info.accessToken,
      appId: info.appId,
      params: {
        type: 1,
        id: info.did,
        params: {
          switches: [{ 
            switch: on ? 'on' : 'off', 
            outlet: index || 0
          }]
        }
      }
    })

    return { response: data.params }
  }
}
