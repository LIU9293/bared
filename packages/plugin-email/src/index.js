const extendedUserSchemas = require('./user')
const routes = require('./router')
const emailProviderSchema = require('./emailProviderSchema')

module.exports = () => {
  return {
    extendUserSchema: schema => {
      return {
        ...schema,
        attributes: {
          ...schema.attributes,
          ...extendedUserSchemas
        }
      }
    },
  
    schemas: [emailProviderSchema],
  
    routers: [
      {
        name: 'email',
        routes
      }
    ]
  }
}
