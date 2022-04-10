const axios = require('axios')
const baseUrl = 'http://localhost:3001'

async function login (username, password) {
  const userResponse = await axios({
    url: baseUrl + '/api/auth/login/local',
    method: 'post',
    data: { username, password }
  })
  return userResponse.data
}

async function register (username, password) {
  const res = await axios({
    url: baseUrl + '/api/auth/register/local',
    method: 'post',
    data: { username, password }
  })

  return res.data
}

async function run () {
  try {
    // const res = await register('test_3', 'test_3')
    const res = await login('test_3', 'test_3')
    // console.log(res)
    const res2 = await axios({
      url: baseUrl + '/papi/auth/profile/update',
      method: 'post',
      headers: { authorization: `Bearer ${res.jwt}` },
      data: {
        avatar: 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM5WLmo6QYmBhT0iafxCqWLTgT1ICQjmjhs0tzuB60FUvyQ/0',
        name: 'Test User 3'
      }
    })

    console.log(res2)
  } catch (error) {
    console.log(error.message)
  }
  process.exit(0)
}

run()
