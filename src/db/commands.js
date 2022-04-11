function alterColumn (t, field) {
  let col
  switch (field.type) {
    case 'string':
      col = t.string(field.name)
      break
    case 'integer':
      col = t.integer(field.name)
      break
    case 'boolean':
      col = t.boolean(field.name)
      break
    case 'text':
      col = t.text(field.name)
      break
    case 'date':
      col = t.date(field.name)
      break
    case 'datetime':
      col = t.datetime(field.name)
      break
    case 'enum':
      col = t.enum(field.name, field.enum)
      break
    case 'json':
      col = t.json(field.name)
      break
    default:
      break
  }

  if (field.required) {
    col.notNullable()
  }

  if (typeof field.default !== 'undefined') {
    col.defaultTo(field.default)
  }

  col.alter()
}

function insertKnexFields (t, field) {
  let col
  switch (field.type) {
    case 'string':
      col = t.string(field.name)
      break
    case 'integer':
      col = t.integer(field.name)
      break
    case 'boolean':
      col = t.boolean(field.name)
      break
    case 'text':
      col = t.text(field.name)
      break
    case 'date':
      col = t.date(field.name)
      break
    case 'datetime':
      col = t.datetime(field.name)
      break
    case 'enum':
      col = t.enum(field.name, field.enum)
      break
    case 'json':
      col = t.json(field.name)
      break
    default:
      break
  }

  if (field.required) {
    col.notNullable()
  }

  if (typeof field.default !== 'undefined') {
    col.defaultTo(field.default)
  }

  if (field.unique) {
    col.unique()
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
    } else {
      // loop each column and update
      // TODO: handle unique change (maybe throw error?)
      await knex.schema.alterTable(tableName, t => {
        alterColumn(t, field)
      })
    }
  }
}

async function createTable (knex, tableName, fields) {
  const res = await knex.schema.createTable(tableName, t => {
    t.increments() // primary key, id, auto increament
    fields.forEach(f => insertKnexFields(t, f)) // user defined columns
    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  return res
}

module.exports = {
  checkAndUpdateTableColumns,
  createTable
}
