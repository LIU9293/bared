// expose a public API for authorization callback
const { authCallback } = require('./controller')

module.exports = [
  {
    url: '/meituan/auth/callback/:appid',
    description: 'Callback from meituan when user authorize, to get accessToken',
    method: 'GET',
    controller: authCallback,
    public: true,
    description: 'Meituan auth callback',
    query: true
  },
]