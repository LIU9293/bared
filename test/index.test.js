require('dotenv').config()
const Bared = require('../src')
const axios = require('axios')

describe('Server', () => {
  beforeAll(async () => {
    await Bared.start()
  })

  afterAll(async () => {
    await Bared.stop()
  })

  test('server should start properly', async () => {
    expect(bared).toBeDefined()
    const res = await axios.get('http://localhost:3000/ping')
    expect(res.data).toBe('pong')
  })

  test('server should generate user table', async () => {
    const userTableExist = await bared.knex.schema.hasTable('user')
    expect(userTableExist).toBe(true)
  })

  test('server should generate root user with auth_type=developer', async () => {
    const rootUser = await bared.services.get('user', { id: 1 })
    expect(rootUser.auth_type).toBe('developer')
  })
})
