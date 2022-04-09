const axios = require('axios')
const baseUrl = 'https://bared-cms-1804794-1311017114.ap-shanghai.run.tcloudbase.com'

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
    console.log(jwt)
    const res = await axios({
      url: baseUrl + '/dapi/user/1',
      method: 'put',
      headers: { authorization: `Bearer ${jwt}` },
      data: {
        avatar: 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM5WLmo6QYmBhT0iafxCqWLTgT1ICQjmjhs0tzuB60FUvyQ/0'
      }
    })

    console.log(res.data)
  } catch (error) {
    console.log(error.message)
  }
  process.exit(0)
}

run()
