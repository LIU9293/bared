const bcrypt = require('bcrypt')
const { whereBuilder } = require('./queryBuilder')

const getService = async (tableName, query) => {
  const res = await bared
    .knex(tableName)
    .where(builder => {
      whereBuilder(tableName, builder, query)
    })
    .first()
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

const getListService = async (tableName, query = {}) => {
  const start = query._start || 0
  const limit = query._limit || 20
  const sort = query._sort || 'created_at:desc'

  /**
   * _q=test, search should be mixed with other querys?
   * _q=test&id_in=[1,2,3]
   */
  const res = await bared.knex(tableName)
    .where(builder => {
      whereBuilder(tableName, builder, query)
    })
    .offset(start)
    .limit(limit)
    .orderBy(sort.split(':')[0], sort.split(':')[1])

  return res
}

const createService = async (tableName, query) => {
  if (tableName === 'user') {
    const hashedPassword = await bcrypt.hash(query.password, 10)
    query.password = hashedPassword
  }

  const res = await bared
    .knex(tableName)
    .insert(query)
  const id = res[0]
  const item = await getService(tableName, { id })
  return item
}

const updateService = async (tableName, id, updateQuery) => {
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

  const item = await getService(tableName, { id })
  return item
}

const deleteService = async (tableName, query) => {
  const res = await bared
    .knex(tableName)
    .where(builder => {
      whereBuilder(tableName, builder, query)
    })
    .del()
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
