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
    url: 'https://open-cn.aqara.com/v3.0/open/api',
    method,
    headers,
    data: { intent, data }
  })

  if (res.data && (res.data.code === 0 || res.data.code === 200)) {
    return res.data.result
  }

  throw new Error('aqara api error:' + ' ' + (res.data.msgDetails || res.data.message))
}

module.exports = {
  async aqaraAccountAuth (ctx, { aqaraDeveloperId, account }) {
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
        accessTokenValidity: '1y'
      },
      appId,
      appKey,
      keyId
    })

    return result
  },

  async aqaraVerifyAuthCode (ctx, { aqaraDeveloperId, account, authCode }) {
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
    const aqaraUser = await ctx.queries.upsert('aqara_user', { openId }, {
      accessToken,
      openId,
      refreshToken,
      expiresIn,
      account,
      developerId: id
    })

    return aqaraUser
  },

  async aqaraUpdateDevicesForAccount (ctx, { aqaraUserId, page = 1 }) {
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
      await ctx.services.aqaraUpdateDevicesForAccount(ctx, { aqaraUserId, page: page + 1 })
    }

    return { success: true }
  },

  async aqaraGetDeviceResoures (ctx, { did }) {
    const prepareInfo = await ctx.knex('aqara_device')
      .join('aqara_user', 'aqara_device.aqaraUserId', '=', 'aqara_user.id')
      .join('aqara_developer', 'aqara_user.developerId', '=', 'aqara_developer.id')
      .select('aqara_device.model', 'aqara_device.did', 'aqara_user.accessToken', 'aqara_developer.appId', 'aqara_developer.appKey', 'aqara_developer.keyId')
      .where('aqara_device.did', did)
      .first()

    if (!prepareInfo) {
      throw new Error(`Resource not found for did ${did}`)
    }

    const { accessToken, appId, appKey, keyId } = prepareInfo
    const res = await request({
      intent: 'query.resource.name',
      data: {
        subjectIds: [did]
      },
      appId,
      appKey,
      keyId,
      accessToken
    })

    return res
  },

  async aqaraGetDeviceResoureDetail (ctx, { did, resourceId }) {
    const prepareInfo = await ctx.knex('aqara_device')
      .join('aqara_user', 'aqara_device.aqaraUserId', '=', 'aqara_user.id')
      .join('aqara_developer', 'aqara_user.developerId', '=', 'aqara_developer.id')
      .select('aqara_device.model', 'aqara_device.did', 'aqara_user.accessToken', 'aqara_developer.appId', 'aqara_developer.appKey', 'aqara_developer.keyId')
      .where('aqara_device.did', did)
      .first()

    if (!prepareInfo) {
      throw new Error(`Resource not found for did ${did}`)
    }

    const { model, accessToken, appId, appKey, keyId } = prepareInfo

    const res = await request({
      intent: 'query.resource.info',
      data: {
        model,
        resourceId
      },
      appId,
      appKey,
      keyId,
      accessToken
    })

    return res
  },

  async aqaraGetDeviceResoureValue (ctx, { did, resourceId }) {
    const prepareInfo = await ctx.knex('aqara_device')
      .join('aqara_user', 'aqara_device.aqaraUserId', '=', 'aqara_user.id')
      .join('aqara_developer', 'aqara_user.developerId', '=', 'aqara_developer.id')
      .select('aqara_device.id', 'aqara_device.did', 'aqara_user.accessToken', 'aqara_developer.appId', 'aqara_developer.appKey', 'aqara_developer.keyId')
      .where('aqara_device.did', did)
      .first()

    if (!prepareInfo) {
      throw new Error(`Resource not found for did ${did}`)
    }

    const { accessToken, appId, appKey, keyId } = prepareInfo
    const res = await request({
      intent: 'query.resource.value',
      data: {
        resources: [
          {
            subjectId: did,
            resourceIds: [resourceId]
          }
        ]
      },
      appId,
      appKey,
      keyId,
      accessToken
    })

    return res
  },

  async aqaraGetSwitchStatus (ctx, { did }) {
    const prepareInfo = await ctx.knex('aqara_device')
      .join('aqara_user', 'aqara_device.aqaraUserId', '=', 'aqara_user.id')
      .join('aqara_developer', 'aqara_user.developerId', '=', 'aqara_developer.id')
      .select('aqara_device.model', 'aqara_device.did', 'aqara_user.accessToken', 'aqara_developer.appId', 'aqara_developer.appKey', 'aqara_developer.keyId')
      .where('aqara_device.did', did)
      .first()

    if (!prepareInfo) {
      throw new Error(`Resource not found for did ${did}`)
    }

    const { accessToken, appId, appKey, keyId } = prepareInfo
    const res = await request({
      intent: 'query.resource.value',
      data: {
        resources: [
          {
            subjectId: did,
            resourceIds: [
              '4.1.85',
              '4.2.85'
            ]
          }
        ]
      },
      appId,
      appKey,
      keyId,
      accessToken
    })

    return res
  },

  async aqaraTurnSwitch (ctx, { did, resourceId, on = false }) {
    const prepareInfo = await ctx.knex('aqara_device')
      .join('aqara_user', 'aqara_device.aqaraUserId', '=', 'aqara_user.id')
      .join('aqara_developer', 'aqara_user.developerId', '=', 'aqara_developer.id')
      .select('aqara_device.id', 'aqara_device.did', 'aqara_user.accessToken', 'aqara_developer.appId', 'aqara_developer.appKey', 'aqara_developer.keyId')
      .where('aqara_device.did', did)
      .first()

    if (!prepareInfo) {
      throw new Error(`Resource not found for did ${did}`)
    }

    const { accessToken, appId, appKey, keyId } = prepareInfo
    const res = await request({
      intent: 'write.resource.device',
      data: [{
        subjectId: did,
        resources: [
          {
            resourceId,
            value: on ? '1' : '0'
          }
        ]
      }],
      appId,
      appKey,
      keyId,
      accessToken
    })

    return res
  },

  async aqaraTurnSwitchById (ctx, { id, resourceId, on = false }) {
    const prepareInfo = await ctx.knex('aqara_device')
      .join('aqara_user', 'aqara_device.aqaraUserId', '=', 'aqara_user.id')
      .join('aqara_developer', 'aqara_user.developerId', '=', 'aqara_developer.id')
      .select('aqara_device.id', 'aqara_device.did', 'aqara_user.accessToken', 'aqara_developer.appId', 'aqara_developer.appKey', 'aqara_developer.keyId')
      .where('aqara_device.id', id)
      .first()

    if (!prepareInfo) {
      throw new Error(`Device not found for id ${id}`)
    }

    const { did, accessToken, appId, appKey, keyId } = prepareInfo
    const res = await request({
      intent: 'write.resource.device',
      data: [{
        subjectId: did,
        resources: [
          {
            resourceId,
            value: on ? '1' : '0'
          }
        ]
      }],
      appId,
      appKey,
      keyId,
      accessToken
    })

    return res
  }
}
