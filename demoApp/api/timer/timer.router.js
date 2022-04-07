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
    public: false
  },
  {
    method: 'POST',
    url: '/timer/delete',
    controller: deleteTimer,
    public: false
  },
  {
    method: 'GET',
    url: '/timer/my',
    controller: getMyTimers,
    public: false
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
