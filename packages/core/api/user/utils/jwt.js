const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const getTokenOptions = () => {
  return {
    secret: 'insta_demo_secret',
    options: { expiresIn: '30d' }
  }
}

const createToken = () => {
  return crypto.randomBytes(20).toString('hex')
}

const createJwtToken = id => {
  const { options, secret } = getTokenOptions()
  return jwt.sign({ id }, secret, options)
}

const decodeJwtToken = token => {
  const { secret } = getTokenOptions()
  try {
    const payload = jwt.verify(token, secret)
    return { payload, isValid: true }
  } catch (err) {
    return { payload: null, isValid: false }
  }
}

module.exports = {
  createToken,
  createJwtToken,
  getTokenOptions,
  decodeJwtToken
}
