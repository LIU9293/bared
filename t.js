const axios = require('axios')
const baseUrl = 'https://bared-timer-1780628-1310797887.ap-shanghai.run.tcloudbase.com'

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
      url: baseUrl + '/dapi/user',
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
