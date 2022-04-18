require('dotenv').config()
const Bared = require('../src')
// const UserPlugin = require('bared-user-plugin')

async function run () {
  // Bared.use(UserPlugin({
  //   config: {}
  // }))
  await Bared.start()
}

run()
