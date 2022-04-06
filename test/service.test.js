require('dotenv').config()
const Bared = require('../src')

describe('Auth related', () => {
  beforeAll(async () => {
    await Bared.start()
  })

  afterAll(async () => {
    await Bared.stop()
  })

  test('should count user table', async () => {
    const count = await bared.services.count('user')
    console.log(count)
    expect(count).toBeGreaterThan(0)
  })

  test('should create some users', async () => {
    await bared.services.create('user', {
      name: 'test_user',
      avatar: 'test_user.png',
      auth_type: 'basic'
    })

    await bared.services.create('user', {
      name: 'test_user2',
      avatar: 'test_user2.png',
      auth_type: 'basic'
    })

    const count = await bared.services.count('user')
    expect(count).toBe(3)

    const count2 = await bared.services.count('user', { auth_type: 'basic' })
    expect(count2).toBe(2)

    await bared.services.delete('user', { name: 'test_user' })
    await bared.services.delete('user', { name: 'test_user2' })
  })
})
