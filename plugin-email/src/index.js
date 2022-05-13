const extendUserAttributes = require('./config')
const routes = require('./email.router')
const schemas = require('./email-provider.schema')

module.exports = {
  extendUserAttributes,
  routes,
  schemas,
  services: []
}
