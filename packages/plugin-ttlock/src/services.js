const crypto = require('crypto')
const axios = require('axios')

async function ttlockRequest ({ clientId, accessToken, url, data, method = 'POST' }) {
  const params = new URLSearchParams()
  params.append('clientId', clientId)
  params.append('accessToken', accessToken)

  for (const key in data) {
    params.append(key, data[key])
  }

  const result = await axios({
    method,
    url: 'https://api.ttlock.com' + url,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    params
  })

  return result.data
}

module.exports = {
  async fetchTtlockAccessToken (ctx, { ttlockUserId }) {
    const ttlockUser = await ctx.queries.get('ttlock_user', { id: ttlockUserId }, { allowPrivate: true })
    const { username, password, developerId } = ttlockUser
    const ttlockDeveloper = await ctx.queries.get('ttlock_developer', { id: developerId }, { allowPrivate: true })
    const { clientId, clientSecret } = ttlockDeveloper

    const params = new URLSearchParams()
    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)
    params.append('username', username)
    params.append('password', crypto.createHash('md5').update(password).digest('hex'))

    const result = await axios({
      method: 'POST',
      url: 'https://api.ttlock.com/oauth2/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params
    })

    const { data } = result
    if (data.access_token) {
      if (process.env.IS_DEV) {
        console.log(`${new Date().toLocaleTimeString()} - get ttlock token for ${ttlockUser.username} succeed`)
      }

      await ctx.queries.update('ttlock_user', { id: ttlockUserId }, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        // uid: data.uid.toString(),
        lastUpdateTime: parseInt(new Date().getTime() / 1000),
        expireIn: parseInt(data.expires_in)
      })

      return { success: true, data }
    } else {
      return data
    }
  },

  async refreshTtlockToken (ctx, { ttlockUserId }) {
    const ttlockUser = await ctx.queries.get('ttlock_user', { id: ttlockUserId }, { allowPrivate: true })
    const { refreshToken, developerId } = ttlockUser
    const ttlockDeveloper = await ctx.queries.get('ttlock_developer', { id: developerId }, { allowPrivate: true })
    const { clientId, clientSecret } = ttlockDeveloper

    const params = new URLSearchParams()

    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)
    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', refreshToken)

    const result = await axios({
      method: 'POST',
      url: 'https://api.ttlock.com/oauth2/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params
    })

    const { data } = result
    if (data.access_token) {
      if (process.env.IS_DEV) {
        console.log(`${new Date().toLocaleTimeString()} - refresh ttlock token for ${ttlockUser.username} succeed`)
      }

      await ctx.queries.update('ttlock_user', { id: ttlockUserId }, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        // uid: data.uid.toString(),
        lastUpdateTime: parseInt(new Date().getTime() / 1000),
        expireIn: parseInt(data.expires_in)
      })

      return { success: true, data }
    } else {
      return data
    }
  },

  async getLockByLockId (ctx, { lockId }) {
    const prepareData = await ctx.knex('ttlock_lock')
      .join('ttlock_user', 'ttlock_lock.ttlockUserId', '=', 'ttlock_user.id')
      .join('ttlock_developer', 'ttlock_user.developerId', '=', 'ttlock_developer.id')
      .select('ttlock_developer.clientId', 'ttlock_user.accessToken')
      .where('ttlock_lock.lockId', lockId)
      .first()

    const { accessToken, clientId } = prepareData
    const data = await ttlockRequest({
      clientId,
      accessToken,
      url: '/v3/key/get',
      data: {
        date: new Date().getTime(),
        lockId
      }
    })

    return data
  },

  async getLocksAndUpdate (ctx, { ttlockUserId, page = 1, pageSize = 100 }) {
    const ttlockUser = await ctx.queries.get('ttlock_user', { id: ttlockUserId }, { allowPrivate: true })
    const { accessToken, developerId } = ttlockUser
    const ttlockDeveloper = await ctx.queries.get('ttlock_developer', { id: developerId }, { allowPrivate: true })
    const { clientId } = ttlockDeveloper

    const data = await ttlockRequest({
      clientId,
      accessToken,
      url: '/v3/lock/list',
      data: {
        pageNo: page,
        pageSize,
        date: new Date().getTime()
      }
    })

    const { list, pageNo, pages } = data

    if (list && list.length > 0) {
      for (const lock of list) {
        const { lockAlias, lockId, lockData, electricQuantity } = lock
        await ctx.queries.upsert('ttlock_lock', { lockId }, {
          ttlockUserId,
          name: lockAlias,
          lockId,
          lockData,
          electricQuantity
        })
      }
    }

    if (pageNo < pages) {
      await ctx.services.getLocksAndUpdate(ctx, { ttlockUserId, page: pageNo + 1, pageSize })
    }

    return { success: true }
  },

  async refreshAllLocks (ctx, { developerId }) {
    const users = await ctx.queries.getList('ttlock_user', { developerId }, { allowPrivate: true })

    for (const user of users) {
      await ctx.services.getLocksAndUpdate(ctx, { ttlockUserId: user.id })
    }

    return { success: true }
  },

  async getExpireTime (ctx, { id }) {
    const user = await ctx.queries.get('ttlock_user', { id }, { allowPrivate: true })
    const { expireIn, lastUpdateTime } = user
    const expireTime = lastUpdateTime + expireIn
    return { success: true, expireTime: new Date(expireTime * 1000).toLocaleString() }
  }
}
