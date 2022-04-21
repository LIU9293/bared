const bcrypt = require('bcrypt')
const { whereBuilder } = require('./queryBuilder')

const getService = async (
  tableName,
  query = {},
  {
    allowPrivate = false,
    populate = []
  } = {}
) => {
  const schema = bared.schemas.find(i => i.tableName === tableName)
  const res = await bared
    .knex(tableName)
    .where(builder => {
      whereBuilder(tableName, builder, query)
    })
    .first()

  if (!allowPrivate) {
    for (const i in schema.attributes) {
      if (schema.attributes[i].private) {
        delete res[i]
      }
    }
  }

  return res
}

const countService = async (tableName, query = {}) => {
  const res = await bared.knex(tableName)
    .where(builder => {
      whereBuilder(tableName, builder, query)
    })
    .count('id')
  return res[0]['count(`id`)']
}

const getListService = async (tableName, query = {}, { allowPrivate = false } = {}) => {
  const start = query._start || 0
  const limit = query._limit || 20
  const sort = query._sort || 'created_at:desc'

  /**
   * _q=test, search should be mixed with other querys?
   * _q=test&id_in=[1,2,3]
   */
  let res = await bared.knex(tableName)
    .where(builder => {
      whereBuilder(tableName, builder, query)
    })
    .offset(start)
    .limit(limit)
    .orderBy(sort.split(':')[0], sort.split(':')[1])

  if (!allowPrivate) {
    const schema = bared.schemas.find(i => i.tableName === tableName)
    for (const i in schema.attributes) {
      if (schema.attributes[i].private) {
        res = res.map(item => {
          delete item[i]
          return item
        })
      }
    }
  }

  return res
}

const createService = async (tableName, query, { allowPrivate = false } = {}) => {
  if (tableName === 'user') {
    const hashedPassword = await bcrypt.hash(query.password, 10)
    query.password = hashedPassword
  }

  const res = await bared
    .knex(tableName)
    .insert(query)
  const id = res[0]
  const item = await getService(tableName, { id }, { allowPrivate })
  return item
}

const updateService = async (tableName, id, updateQuery, { allowPrivate = false } = {}) => {
  if (tableName === 'user' && updateQuery.password) {
    const hashedPassword = await bcrypt.hash(updateQuery.password, 10)
    updateQuery.password = hashedPassword
  }

  await bared
    .knex(tableName)
    .where({ id })
    .update({
      ...updateQuery,
      updated_at: bared.knex.fn.now()
    })

  const item = await getService(tableName, { id }, { allowPrivate })
  return item
}

const deleteService = async (tableName, query) => {
  const res = await bared
    .knex(tableName)
    .where(builder => {
      whereBuilder(tableName, builder, query)
    })
    .del()

  if (!res) {
    throw new Error('delete item not found')
  }
  return res
}

function registerServices () {
  bared.services = {
    get: getService,
    getList: getListService,
    create: createService,
    update: updateService,
    delete: deleteService,
    count: countService
  }
}

module.exports = registerServices
