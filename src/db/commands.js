function insertKnexFields (t, field) {
  switch (field.type) {
    case 'string':
      t.string(field.name)
      break
    case 'integer':
      t.integer(field.name)
      break
    case 'boolean':
      t.boolean(field.name)
      break
    case 'text':
      t.text(field.name)
      break
    case 'date':
      t.date(field.name)
      break
    case 'datetime':
      t.datetime(field.name)
      break
    case 'enum':
      t.enum(field.name, field.enum)
      break
    default:
      break
  }
}

async function checkAndUpdateTableColumns (knex, tableName, fields) {
  for (const i in fields) {
    const field = fields[i]
    const hasColumn = await knex.schema.hasColumn(tableName, field.name)

    if (!hasColumn) {
      await knex.schema.table(tableName, t => {
        insertKnexFields(t, field)
      })
      console.log(`> database table \`${tableName}\` column \`${field.name}\` updated`)
    }
  }
}

async function createTable (knex, tableName, fields) {
  const res = await knex.schema.createTable(tableName, t => {
    t.increments()
    fields.forEach(f => insertKnexFields(t, f))
    // t.timestamps().defaultTo(knex.fn.now())
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  return res
}

module.exports = {
  checkAndUpdateTableColumns,
  createTable
}
