require('dotenv').config()
const Bared = require('./src')

async function run () {
  await Bared.start()
}

run()
