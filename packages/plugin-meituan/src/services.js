const qs = require('qs')
const crypto = require('crypto')
const axios = require('axios')
const { formatInTimeZone } = require('date-fns-tz')

function genMd5 (text) {
  return crypto.createHash('md5').update(text, 'utf-8').digest('hex')
}

function sign (param, appsecret) {
  const lists = []
  let ps = appsecret
  for (const item in param) {
    lists.push(item)
  }
  lists.sort()
  lists.forEach(function (key) {
    ps += key + param[key]
  })
  ps += appsecret
  return genMd5(ps)
}

module.exports = {
  async meituanRefreshToken (ctx, { meituanAppId }) {
    const meituanApp = await ctx.queries.get('meituan_app', { id: meituanAppId }, { allowPrivate: true })
    const { refreshToken, appKey, appSecret, name } = meituanApp

    const data = {
      app_key: appKey,
      app_secret: appSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }

    const result = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      url: 'https://openapi.dianping.com/router/oauth/token',
      data: qs.stringify(data)
    })

    if (result.data.code && result.data.code === 200) {
      if (process.env.IS_DEV) {
        console.log(`-- refresh dianping token for id ${meituanAppId} succeed --`)
        console.log(result.data)
      }

      const res = await ctx.queries.update('meituan_app', { id: meituanAppId }, {
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
        bid: result.data.bid,
        refreshCount: result.data.remain_refresh_count,
        lastUpdateTime: new Date().getTime() / 1000,
        expireIn: result.data.expires_in
      })

      return res
    } else {
      console.log(`${new Date().toLocaleTimeString()} - [ERROR] - refresh dianping token for ${name || meituanAppId} error`)
      console.log(result.data)
      throw new Error(result.data)
    }
  },

  async meituanFetchShops (ctx, { meituanAppId, page = 1 }) {
    const meituanApp = await ctx.queries.get('meituan_app', { id: meituanAppId }, { allowPrivate: true })
    const { appKey, accessToken, bid, appSecret } = meituanApp
    const ts = formatInTimeZone(new Date(), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss')
    const params = {
      app_key: appKey,
      timestamp: ts,
      session: accessToken,
      bid,
      format: 'json',
      v: 1,
      sign_method: 'MD5',
      offset: (page - 1) * 100,
      limit: 100
    }
    const sig = sign(params, appSecret)
    const str = qs.stringify({ ...params, sign: sig })
    const result = await axios.get(`https://openapi.dianping.com/router/oauth/session/scope?${str}`)

    const { code, data } = result.data

    if (code !== 200) {
      console.log(`ts - ${ts}`)
      throw new Error(result.data.msg)
    }

    for (const shop of data) {
      const { shopname, shopaddress, cityname } = shop
      const uuid = shop.open_shop_uuid
      await ctx.queries.upsert('meituan_shop', { uuid }, {
        name: shopname,
        uuid,
        meituanAppId,
        city: cityname,
        address: shopaddress
      })
    }

    return data
  },

  async meituanFetchCoupons (ctx, { meituanShopId, page = 1 }) {
    const prepareInfo = await ctx.knex('meituan_shop')
      .join('meituan_app', 'meituan_shop.meituanAppId', '=', 'meituan_app.id')
      .select(
        'meituan_shop.uuid',
        'meituan_app.appKey',
        'meituan_app.appSecret',
        'meituan_app.bid',
        'meituan_app.accessToken'
      )
      .where('meituan_shop.id', meituanShopId)
      .first()

    const { appKey, accessToken, appSecret, uuid } = prepareInfo
    const ts = formatInTimeZone(new Date(), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss')
    const params = {
      app_key: appKey,
      timestamp: ts,
      session: accessToken,
      format: 'json',
      v: 1,
      sign_method: 'MD5',
      open_shop_uuid: uuid,
      // offset: (page - 1) * 100,
      limit: 100
    }
    const sig = sign(params, appSecret)
    const str = qs.stringify({ ...params, sign: sig })
    const result = await axios.get(`https://openapi.dianping.com/tuangou/deal/queryshopdeal?${str}`)

    const { code, data } = result.data
    if (code !== 200) {
      throw new Error(result.data.msg)
    }

    await ctx.queries.delete('meituan_coupon', { meituanShopId })

    for (const coupon of data) {
      const { title, price } = coupon
      await ctx.queries.create('meituan_coupon', {
        title,
        meituanShopId,
        price,
        dealId: coupon.deal_id,
        dealGroupId: coupon.dealgroup_id,
        saleStatus: coupon.sale_status
      })
    }

    return data
  },

  async meituanGetTokenValidTime (ctx, { meituanAppId }) {
    const meituanApp = await ctx.queries.get('meituan_app', { id: meituanAppId })
    const { expireIn, lastUpdateTime } = meituanApp

    const now = new Date().getTime()
    const expireTime = new Date((parseInt(lastUpdateTime) + parseInt(expireIn)) * 1000).getTime()
    const diff = expireTime - now

    // hours - 1.43
    return { hours: parseFloat((diff / (60 * 60 * 1000)).toFixed(2)) }
  },

  async meituanGetCouponInfo (ctx, { meituanShopId, code }) {
    const meituanAppInfo = await ctx.knex('meituan_shop')
      .join('meituan_app', 'meituan_shop.meituanAppId', '=', 'meituan_app.id')
      .select('meituan_app.appKey', 'meituan_app.appSecret', 'meituan_app.accessToken', 'meituan_shop.uuid', 'meituan_shop.id')
      .where('meituan_shop.id', meituanShopId)
      .first()

    const { appKey, appSecret, accessToken, uuid } = meituanAppInfo
    const ts = formatInTimeZone(new Date(), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss')

    const prepareParams = {
      app_key: appKey,
      timestamp: ts,
      session: accessToken,
      format: 'json',
      v: 1,
      sign_method: 'MD5',
      receipt_code: code,
      open_shop_uuid: uuid
    }

    const prepareSig = sign(prepareParams, appSecret)
    const prepareResult = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      url: 'https://openapi.dianping.com/router/tuangou/receipt/prepare',
      data: qs.stringify({ ...prepareParams, sign: prepareSig })
    })

    if (prepareResult.data && prepareResult.data.code === 200) {
      return { success: true, data: prepareResult.data.data }
    } else {
      return { success: false, message: prepareResult.data.msg, code: prepareResult.data.code }
    }
  },

  async meituanVerifyCode (ctx, { meituanShopId, code, count = 1 }) {
    const meituanAppInfo = await ctx.knex('meituan_shop')
      .join('meituan_app', 'meituan_shop.meituanAppId', '=', 'meituan_app.id')
      .select('meituan_app.appKey', 'meituan_app.appSecret', 'meituan_app.accessToken', 'meituan_shop.uuid', 'meituan_shop.id')
      .where('meituan_shop.id', meituanShopId)
      .first()

    const { appKey, appSecret, accessToken, uuid } = meituanAppInfo
    const ts = formatInTimeZone(new Date(), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss')

    const params = {
      app_key: appKey,
      timestamp: ts,
      session: accessToken,
      format: 'json',
      v: 1,
      sign_method: 'MD5',
      receipt_code: code,
      open_shop_uuid: uuid,
      requestid: code,
      count,
      app_shop_account: 'moghub',
      app_shop_accountname: 'moghub'
    }

    const sig = sign(params, appSecret)
    const result = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      url: 'https://openapi.dianping.com/router/tuangou/receipt/consume',
      data: qs.stringify({ ...params, sign: sig })
    })

    if (result.data && result.data.code === 200) {
      return { success: true, data: result.data.data }
    } else {
      return { success: false, message: result.data.msg, code: result.data.code }
    }
  }
}
