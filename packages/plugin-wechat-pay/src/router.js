const { paymentCallback3d } = require('./controller')

module.exports = [
  {
    url: '/wechat/pay/notify3d',
    method: 'POST',
    controller: paymentCallback3d,
    public: true,
    description: 'Wechat payment callback',
    params: {
      resource: { type: 'json', required: true }
    }
  }
]
