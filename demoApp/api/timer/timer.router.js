const {
  addTimer,
  deleteTimer,
  getMyTimers,
  updateTimer,
  getTimerDetail,
  getTopTimers
} = require('./controller')

module.exports = [
  {
    method: 'POST',
    url: '/timer/add',
    controller: addTimer,
    public: false,
    description: 'User add one timer to its account',
    params: {
      config: { type: 'json', required: true },
      title: { type: 'string', required: true },
      cover: { type: 'string', required: false },
      is_public: { type: 'boolean', default: false, required: true }
    }
  },
  {
    method: 'POST',
    url: '/timer/delete',
    controller: deleteTimer,
    public: false,
    params: {
      timerId: { type: 'integer', required: true }
    }
  },
  {
    method: 'GET',
    url: '/timer/my',
    controller: getMyTimers,
    public: false,
    params: {
      start: { type: 'integer', required: false, default: 0 },
      limit: { type: 'integer', required: false, default: 20 }
    }
  },
  {
    method: 'POST',
    url: '/timer/update',
    controller: updateTimer,
    public: false
  },
  {
    method: 'GET',
    url: '/timer/:id',
    controller: getTimerDetail,
    public: true
  },
  {
    method: 'GET',
    url: '/timer/top',
    controller: getTopTimers,
    public: true
  }
]
