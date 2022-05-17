const extendedUserSchemas = require('./user')
const routes = require('./router')

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

  routers: [
    {
      name: 'email',
      routes
    }
  ]
}
