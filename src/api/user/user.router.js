const { loginLocal, registerLocal, updateProfile, getProfile } = require('./controller')

module.exports = [
  {
    url: '/auth/register/local',
    method: 'POST',
    controller: registerLocal,
    public: true,
    description: 'Register a local user with username and password',
    params: {
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }
  },
  {
    url: '/auth/login/local',
    method: 'POST',
    controller: loginLocal,
    public: true,
    description: 'Login a local user with username and password',
    params: {
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }
  },
  {
    url: '/auth/profile',
    method: 'GET',
    controller: getProfile,
    public: false,
    description: 'Get user profile directly'
  },
  {
    url: '/auth/profile/update',
    method: 'POST',
    controller: updateProfile,
    public: false,
    description: 'Update user profile, such as avatar / name',
    params: {
      name: { type: 'string', required: false },
      avatar: { type: 'string', required: false }
    }
  }
]
