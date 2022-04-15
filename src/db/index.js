// get the client
const path = require('path')
const glob = require('glob')
const Knex = require('knex')
const {
  checkAndUpdateTableColumns,
  createTable
} = require('./commands')

const databaseConfigAddr = glob.sync('./**/database/config.js')
const databaseConfig = require(path.resolve(databaseConfigAddr[0]))

async function registerDatabase () {
  const knex = Knex({
    client: 'mysql2',
    connection: databaseConfig
  })

  global.bared.knex = knex

  const { schemas } = global.bared
  for (const i in schemas) {
    const tableConfig = schemas[i]
    const { tableName, attributes } = tableConfig

    const fields = Object.keys(attributes).map(name => ({
      name,
      ...attributes[name]
    }))

    const hasTable = await knex.schema.hasTable(tableName)
    if (hasTable) {
      await checkAndUpdateTableColumns(knex, tableName, fields)
    } else {
      await createTable(knex, tableName, fields)
      console.log(`> database table \`${tableName}\` created`)
    }
  }
}

module.exports = { registerDatabase }
