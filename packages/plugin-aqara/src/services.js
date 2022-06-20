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
    url: `https://open-cn.aqara.com/v3.0/open/api`,
    method,
    headers,
    data: { intent, data }
  })

  // console.log(res.data)
  if (res.data && (res.data.code === 0 || res.data.code === 200)) {
    return res.data.result
  }

  console.log(`aqara api error: ${res.data.msgDetails || res.data.messageDetail}`)
  throw new Error(res.data.msgDetails || res.data.messageDetail || res.data)
}

module.exports = {
  async getOauthUrl (ctx, { aqaraDeveloperId, }) {
    const aqaraApp = await ctx.queries.get('aqara_developer', { id: aqaraDeveloperId })

    if (!aqaraApp) {
      throw new Error(`aqara developer not found for id ${aqaraDeveloperId}`)
    }

    const { appId } = aqaraApp
    const redirectUrl = `${process.env.BASE_URL || 'https://mogroom.com'}/api/aqara/auth/callback` 
    const url = `https://open-cn.aqara.com/v3.0/open/authorize?client_id=${appId}&response_type=code&redirect_uri=${redirectUrl}&state=${aqaraDeveloperId}`
    return url
  },

  async aqaraRedirect (ctx) {
    const { code, state } = ctx.query

    if (!parseInt(state) || !code) {
      return null
    }

    const aqaraDeveloper = await ctx.queries.get('aqara_developer', { id: parseInt(state) })
    const { appId, appKey, id } = aqaraDeveloper

    const params = new URLSearchParams()
    params.append('client_id', appId)
    params.append('client_secret', appKey)
    params.append('grant_type', 'authorization_code')
    params.append('code', code)

    const redirectUrl = `${process.env.BASE_URL || 'https://mogroom.com'}/api/aqara/auth/callback`
    params.append('redirect_uri', `https://open-cn.aqara.com/v3.0/open/auth?client_id=${appId}&response_type=code&redirect_uri=${redirectUrl}&state=${state}`)

    const result = await axios({
      method: 'POST',
      url: 'https://open-cn.aqara.com/v3.0/open/access_token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params
    })

    const { access_token, refresh_token, openId, expires_in } = result.data
    const aqaraUser = await ctx.queries.upsert('aqara_user', { openId }, {
      accessToken: access_token,
      refreshToken: refresh_token,
      openId,
      expiresIn: expires_in,
      developerId: id
    })

    return aqaraUser
  },

  async generateApiAuth (ctx, { aqaraDeveloperId, account }) {
    const aqaraDeveloper = await ctx.queries.get('aqara_developer', { id: aqaraDeveloperId }, { allowPrivate: true })

    if (!aqaraDeveloper) {
      throw new Error(`Aqara developer not found for id ${aqaraDeveloperId}`)
    }

    const { appId, appKey, keyId } = aqaraDeveloper

    const result = await request({
      intent: 'config.auth.getAuthCode',
      data: {
        account,
        accountType: 0,
        accessTokenValidity: "1y"
      },
      appId,
      appKey,
      keyId
    })

    console.log(result)
    return result
  },

  async getAccessTokenByAuthCode (ctx, { aqaraDeveloperId, account, authCode }) {
    const aqaraDeveloper = await ctx.queries.get('aqara_developer', { id: aqaraDeveloperId }, { allowPrivate: true })

    if (!aqaraDeveloper) {
      throw new Error(`Aqara developer not found for id ${aqaraDeveloperId}`)
    }

    const { appId, appKey, keyId, id } = aqaraDeveloper
    const result = await request({
      intent: 'config.auth.getToken',
      data: {
        account,
        accountType: 0,
        authCode
      },
      appId,
      appKey,
      keyId
    })

    const { accessToken, openId, refreshToken, expiresIn } = result
    const aqaraUser = await ctx.queries.create('aqara_user', {
      accessToken,
      openId,
      refreshToken,
      expiresIn,
      account,
      developerId: id
    })

    return aqaraUser
  },

  async getDevicesAndUpdate (ctx, { aqaraUserId, page = 1 }) {
    const pageSize = 100
    const aqaraUser = await ctx.queries.get('aqara_user', { id: aqaraUserId })
    const { accessToken, developerId, id } = aqaraUser
    const aqaraDeveloper = await ctx.queries.get('aqara_developer', { id: developerId }, { allowPrivate: true })
    const { appId, appKey, keyId } = aqaraDeveloper

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
      await ctx.queries.upsert('aqara_device', { did }, {
        aqaraUserId: id,
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
      await getDevicesAndUpdate(ctx, { aqaraUserId, page: page + 1 })
    }

    return { success: true }
  }
}