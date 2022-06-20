const aqaraDeveloperSchema = require('./aqaraDeveloperSchema')
const aqaraUserSchema = require('./aqaraUserSchema')
const aqaraDeviceSchema = require('./aqaraDeviceSchema')
const {
  generateApiAuth,
  getAccessTokenByAuthCode,
  getDevicesAndUpdate
} = require('./services')

module.exports = () => {
  return {
    pluginName: 'aqara',
    extendUserSchema: schema => schema,
    schemas: [
      aqaraDeveloperSchema,
      aqaraUserSchema,
      aqaraDeviceSchema
    ],
    routers: [],
    middlewares: [],
    services: [
      {
        name: 'generateApiAuth',
        service: generateApiAuth,
        showInAdmin: true,
        params: {
          aqaraDeveloperId: 'integer',
          account: 'string'
        }
      },
      {
        name: 'getAccessTokenByAuthCode',
        service: getAccessTokenByAuthCode,
        showInAdmin: true,
        params: {
          aqaraDeveloperId: 'integer',
          account: 'string',
          authCode: 'string'
        }
      },
      {
        name: 'getDevicesAndUpdate',
        service: getDevicesAndUpdate,
        showInAdmin: true,
        params: {
          aqaraUserId: 'integer'
        }
      }
    ]
  }
}
