
/**
 * @param {staing} tableName => to get all columns
 * @param {*} builder
 * @param {*} query => ctx.state.query
 */
const whereBuilder = (tableName, builder, query) => {
  const schema = bared.schemas.find(i => i.tableName === tableName)
  const columns = Object.keys(schema.attributes).concat(['id'])

  // query  { auth_type~eq: 'basic', age~gt: 10 }
  const userSearchKeys = Object.keys(query).filter(i => i.slice(0, 1) !== '_')
  userSearchKeys.forEach(key => {
    const [column, matchKey] = key.split('~')
    if (columns.indexOf(column) >= 0) {
      switch (matchKey) {
        case 'eq':
          builder.where({ [column]: query[key] })
          break

        case 'gt':
          builder.where(column, '>', query[key])
          break

        case 'gte':
          builder.where(column, '>=', query[key])
          break

        case 'lt':
          builder.where(column, '<', query[key])
          break

        case 'lte':
          builder.where(column, '<=', query[key])
          break

        case 'in':
          // query[key] -> [1,2,3]
          builder.whereIn(column, JSON.parse(query[key]))
          break

        case 'nin':
          builder.whereNotIn(column, JSON.parse(query[key]))
          break
        default:
          break
      }
    }
  })
}

module.exports = { whereBuilder }
