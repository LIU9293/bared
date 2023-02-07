const crypto = require('crypto')

function WXBizDataCrypt (appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  var sessionKey = Buffer.from(this.sessionKey, 'base64') // eslint-disable-line
  encryptedData = Buffer.from(encryptedData, 'base64') // eslint-disable-line
  iv = Buffer.from(iv, 'base64') // eslint-disable-line
  let decoded
  try {
    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)

    decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    decoded = JSON.parse(decoded)
  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== this.appId) {
    console.log('decoded.watermark.appid: ', decoded.watermark.appid)
    console.log('this.appId: ', this.appId)
    throw new Error('Illegal Buffer')
  }

  return decoded
}

module.exports = WXBizDataCrypt
