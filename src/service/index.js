const { whereBuilder } = require('./queryBuilder')

const getService = async (tableName, query) => {
  const res = await bared
    .knex(tableName)
    .where(builder => {
      Object.keys(query).forEach(key => {
        builder.where({ [key]: query[key] })
      })
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
  const res = await bared
    .knex(tableName)
    .insert(query)
  return res
}

const updateService = async (tableName, searchQuery, updateQuery) => {
  const res = await bared
    .knex(tableName)
    .where(searchQuery)
    .update({
      ...updateQuery,
      updated_at: bared.knex.fn.now()
    })
  return res
}

const deleteService = async (tableName, query) => {
  const res = await bared
    .knex(tableName)
    .where(builder => {
      Object.keys(query).forEach(key => {
        builder.where({ [key]: query[key] })
      })
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
