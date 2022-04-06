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

const knex = Knex({
  client: 'mysql2',
  connection: databaseConfig
})

global.bared.knex = knex

async function registerDatabase () {
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

async function clearDatabase () {
  const { schemas } = global.bared

  for (const i in schemas) {
    const tableConfig = schemas[i]
    const { tableName } = tableConfig

    const hasTable = await knex.schema.hasTable(tableName)
    if (hasTable) {
      await knex.schema.dropTable(tableName)
      console.log(`> database table ${tableName} dropped`)
    }
  }
}

module.exports = { registerDatabase, clearDatabase }
