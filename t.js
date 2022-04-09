const axios = require('axios')
const baseUrl = 'http://localhost:3001'

async function login (id) {
  const userResponse = await axios({
    url: baseUrl + '/auth/login/test',
    method: 'post',
    data: { id }
  })
  const { jwt } = userResponse.data
  return jwt
}

async function run () {
  try {
    const jwt = await login(1)
    const res = await axios({
      url: baseUrl + '/dapi/timer/2',
      method: 'get',
      headers: { authorization: `Bearer ${jwt}` }
    })

    console.log(res.data)
  } catch (error) {
    console.log(error.message)
  }
  process.exit(0)
}

run()
