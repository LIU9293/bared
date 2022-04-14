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
    const res = await login('root', 'root')
    const res2 = await axios({
      url: baseUrl + '/dapi/user?id~in=[4,5,6]&id~gte=5&_q=bili2',
      method: 'get',
      headers: { authorization: `Bearer ${res.jwt}` }
    })
    console.log(res2.data)
  } catch (error) {
    console.log(error.message)
  }
  process.exit(0)
}

run()
