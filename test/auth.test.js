require('dotenv').config()
const Bared = require('../src')
const axios = require('axios')

describe('Auth related', () => {
  beforeAll(async () => {
    await Bared.start()
  })

  afterAll(async () => {
    await Bared.stop()
  })

  test('should login root user properly', async () => {
    expect(bared).toBeDefined()
    const res = await axios({
      url: 'http://localhost:3000/auth/login/test',
      method: 'post',
      data: { id: 1 }
    })
    // console.log(res.data)
    const { jwt, user } = res.data
    expect(jwt).toBeDefined()
    expect(user.name).toBe('admin')
  })
})
