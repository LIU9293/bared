require('dotenv').config()
const Bared = require('../src')
const EmailPlugin = require('../plugin-email/src')

async function run () {
  await Bared.start({
    plugins: [EmailPlugin]
  })
}

run()
