
/**
 * @param {*} query => ctx.state.query
 */
const whereBuilder = (schema, builder, query) => {
  const columns = Object.keys(schema.attributes).concat(['id'])
  const userQueryKeys = Object
    .keys(query)
    .filter(i => i.slice(0, 1) !== '_')

  userQueryKeys.forEach(key => {
    if (key.indexOf('~') < 0) {
      builder.where({ [key]: query[key] })
    } else {
      const [column, matchKey] = key.split('~')
      if (columns.indexOf(column) >= 0) {
        switch (matchKey) {
          case 'eq':
            builder.where({ [column]: query[key] })
            break

          case 'ne':
            builder.where(column, '!=', query[key])
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
            builder.whereIn(
              column,
              typeof query[key] === 'string'
                ? JSON.parse(query[key])
                : query[key]
            )
            break

          case 'nin':
            builder.whereNotIn(
              column,
              typeof query[key] === 'string'
                ? JSON.parse(query[key])
                : query[key]
            )
            break
          default:
            builder.where({ [column]: query[key] })
            break
        }
      }
    }
  })

  if (query._q) {
    const [key, value] = query._q.split(':')
    if (value) {
      builder.whereILike(key, `%${value}%`)
    }
  }
}

module.exports = { whereBuilder }
