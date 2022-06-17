const bcrypt = require('bcrypt')
const { whereBuilder } = require('./queryBuilder')

const getService = (schemas, knex) =>
  async (
    tableName,
    query = {},
    { allowPrivate = false } = {}
  ) => {
    const schema = schemas.find(i => i.tableName === tableName)
    const res = await knex(tableName)
      .where(builder => {
        whereBuilder(schema, builder, query)
      })
      .first()

    if (!allowPrivate && res) {
      for (const i in schema.attributes) {
        if (schema.attributes[i].private) {
          delete res[i]
        }
      }
    }

    return res
  }

const countService = (schemas, knex) =>
  async (
    tableName,
    query = {}
  ) => {
    const schema = schemas.find(i => i.tableName === tableName)
    const res = await knex(tableName)
      .where(builder => {
        whereBuilder(schema, builder, query)
      })
      .count('id')
    return res[0]['count(`id`)']
  }

const getListService = (schemas, knex) =>
  async (
    tableName,
    query = {},
    { allowPrivate = false } = {}
  ) => {
    const start = query._start || 0
    const limit = query._limit || 20
    const sort = query._sort || 'created_at:desc'

    const schema = schemas.find(i => i.tableName === tableName)

    /**
   * _q=test, search should be mixed with other querys?
   * _q=test&id_in=[1,2,3]
   */
    let res = await knex(tableName)
      .where(builder => {
        whereBuilder(schema, builder, query)
      })
      .offset(start)
      .limit(limit)
      .orderBy(sort.split(':')[0], sort.split(':')[1])

    if (!allowPrivate) {
      const schema = schemas.find(i => i.tableName === tableName)
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

const createService = (schemas, knex) =>
  async (
    tableName,
    query,
    { allowPrivate = false } = {}
  ) => {
    
    // hard code if is user table and has password
    if (tableName === 'user' && query.password) {
      const hashedPassword = await bcrypt.hash(query.password, 10)
      query.password = hashedPassword
    }

    const res = await knex(tableName).insert(query)
    const id = res[0]

    const item = await getService(schemas, knex)(tableName, { id }, { allowPrivate })
    return item
  }

const updateService = (schemas, knex) =>
  async (
    tableName,
    id,
    updateQuery,
    { allowPrivate = false } = {}
  ) => {
    if (tableName === 'user' && updateQuery.password) {
      const hashedPassword = await bcrypt.hash(updateQuery.password, 10)
      updateQuery.password = hashedPassword
    }

    await knex(tableName)
      .where({ id })
      .update({
        ...updateQuery,
        updated_at: knex.fn.now()
      })

    const item = await getService(schemas, knex)(tableName, { id }, { allowPrivate })
    return item
  }

const deleteService = (schemas, knex) =>
  async (
    tableName,
    query
  ) => {
    const schema = schemas.find(i => i.tableName === tableName)
    const res = await knex(tableName)
      .where(builder => {
        whereBuilder(schema, builder, query)
      })
      .del()

    if (!res) {
      throw new Error('delete item not found')
    }
    return res
  }

const upsertService = (schemas, knex) => async (
  tableName,
  query,
  data,
  { allowPrivate = false } = {}
) => {
  const existing = await getService(schemas, knex)(tableName, query, { allowPrivate })
  if (!existing) {
    const item = await createService(schemas, knex)(tableName, data, { allowPrivate })
    return item
  } else {
    const updated = await updateService(schemas, knex)(tableName, existing.id, query, { allowPrivate })
    return updated
  }
}

module.exports = {
  getList: getListService,
  get: getService,
  update: updateService,
  count: countService,
  delete: deleteService,
  create: createService,
  upsert: upsertService
}
