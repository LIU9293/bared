const axios = require('axios')

async function login (id) {
  const userResponse = await axios({
    url: 'http://localhost:3000/auth/login/test',
    method: 'post',
    data: { id }
  })
  const { jwt } = userResponse.data
  return jwt
}

async function run () {
  const jwt = await login(1)
  const res = await axios({
    url: 'http://localhost:3000/ping',
    method: 'get',
    headers: { authorization: `Bearer ${jwt}` }
  })

  console.log(res.data)
  // console.log(jwt)
  process.exit(0)
}

run()
