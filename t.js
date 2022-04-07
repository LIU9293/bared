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
  try {
    const jwt = await login(4)
    const res = await axios({
      url: 'http://localhost:3000/papi/create-post',
      method: 'post',
      headers: { authorization: `Bearer ${jwt}` },
      data: {
        title: 'test-post',
        cover: 'test-post.png',
        category: 'tech'
      }
    })

    console.log(res.data)
  } catch (error) {
    console.log(error.message)
  }
  process.exit(0)
}

run()
