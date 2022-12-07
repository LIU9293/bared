const {
  registerOrLogin,
  registerOrLoginNative,
  updatePhoneNumberWechat
} = require('./controllers')

module.exports = [
  {
    url: '/auth/register/wechat',
    method: 'POST',
    controller: registerOrLogin,
    public: true,
    description: 'Register a user with wechat - wx.login()',
    params: {
      code: { type: 'string', required: true }
    }
  },
  {
    url: '/auth/register/wechat/native',
    method: 'POST',
    controller: registerOrLoginNative,
    public: true,
    description: 'Login by wx.cloud.callContainer'
  },
  {
    url: '/auth/phone/update',
    method: 'POST',
    controller: updatePhoneNumberWechat,
    public: false,
    description: '更新用户手机号',
    params: {
      encryptedData: { type: 'string', required: true },
      iv: { type: 'string', required: true }
    }
  },
]
