// expose a public API for authorization callback
const { authCallback } = require('./controller')

module.exports = [
  {
    url: '/meituan/auth/callback',
    method: 'POST',
    controller: authCallback,
    public: true,
    description: 'Meituan auth callback',
    params: {
      appid: { type: 'string', required: true },
    },
    query: true
  },
]