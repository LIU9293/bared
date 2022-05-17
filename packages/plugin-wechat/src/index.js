const extendedUserSchemas = require('./user')

module.exports = {
  extendUserSchema: schema => {
    return {
      ...schema,
      attributes: {
        ...schema.attributes,
        ...extendedUserSchemas
      }
    }
  },

  schemas: [],
  routers: []
}
