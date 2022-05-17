const Knex = require('knex')
const {
  checkAndUpdateTableColumns,
  createTable
} = require('./commands')

function registerDatabase (config) {
  const defaultConfig = {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'bared'
    },
    acquireConnectionTimeout: 10000
  }

  const knex = Knex({
    ...defaultConfig,
    ...config
  })

  return knex
}

async function registerSchemas (knex, schemas) {
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

module.exports = {
  registerDatabase,
  registerSchemas
}
