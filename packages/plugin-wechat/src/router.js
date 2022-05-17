const { registerOrLogin } = require('./controllers')

module.exports = [
  {
    url: '/auth/register/wechat',
    method: 'POST',
    controller: registerOrLogin,
    public: true,
    description: 'Register a user with wechat - wx.login()',
    params: {
      code: { type: 'string', required: true },
    }
  }
]
