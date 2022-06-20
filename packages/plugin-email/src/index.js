const extendedUserSchemas = require('./user')
const routes = require('./router')
const emailProviderSchema = require('./emailProviderSchema')
const { sendEmail} = require('./services')

module.exports = () => {
  return {
    pluginName: 'email',
    extendUserSchema: schema => {
      return {
        ...schema,
        attributes: {
          ...schema.attributes,
          ...extendedUserSchemas
        }
      }
    },
  
    schemas: [
      emailProviderSchema,
    ],
  
    services: [
      {
        name: 'sendEmail',
        service: sendEmail,
        params: {
          providerId: 'integer',
          to: 'string',
          title: 'string',
          body: 'text'
        }
      }
    ],

    routers: [
      {
        name: 'email',
        routes
      }
    ]
  }
}
