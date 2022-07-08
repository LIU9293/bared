/* eslint-disable */
require('dotenv').config()

describe('Server', () => {
  test('server should start properly', async () => {
    const res = await axios.get('http://localhost:3000/ping')
    expect(res.data).toBe('pong')
  })
})
