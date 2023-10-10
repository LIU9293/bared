const {
  checkAndUpdateTableColumns,
  createTable
} = require('../db/commands')

async function registerSchemas (knex, schemas, skipCheckSchema) {
  for (const i in schemas) {
    const tableConfig = schemas[i]
    const { tableName, attributes } = tableConfig

    const fields = Object.keys(attributes).map(name => ({
      name,
      ...attributes[name]
    }))

    const hasTable = await knex.schema.hasTable(tableName)
    if (hasTable) {
      await checkAndUpdateTableColumns(knex, tableName, fields, skipCheckSchema)
    } else {
      await createTable(knex, tableName, fields)
      console.log(`> database table \`${tableName}\` created`)
    }
  }
}

module.exports = registerSchemas
