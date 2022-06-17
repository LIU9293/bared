const { getLockById } = require('./controller')

module.exports = [
  {
    url: '/ttlock/:lockId',
    method: 'GET',
    controller: getLockById,
    public: true,
    description: 'Get lock data by lockId'
  }
]