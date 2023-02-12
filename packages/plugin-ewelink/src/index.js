const ewelinkDeveloperSchema = require('./ewelinkDeveloperSchema')
const ewelinkUserSchema = require('./ewelinkUserSchema')
const ewelinkDeviceSchema = require('./ewelinkDeviceSchema')
const {
  ewelinkGenerateAuthUrl,
  ewelinkAccountAuth,
  ewelinkUpdateDevicesForAccount,
  ewelinkTurnSwitch,
  ewelinkGetSwitchStatus,
  ewelinkRefreshToken
} = require('./services')
const ewelinkRoutes = require('./router')

module.exports = () => {
  return {
    pluginName: 'ewelink',
    extendUserSchema: schema => schema,
    schemas: [
      ewelinkDeveloperSchema,
      ewelinkUserSchema,
      ewelinkDeviceSchema
    ],
    routers: [
      {
        name: 'Ewelink',
        routes: ewelinkRoutes
      }
    ],
    middlewares: [],
    services: [
      {
        name: 'ewelinkGenerateAuthUrl',
        service: ewelinkGenerateAuthUrl,
        showInAdmin: true,
        params: {
          ewelinkDeveloperId: 'integer',
          id: 'integer'
        }
      },
      {
        name: 'ewelinkAccountAuth',
        service: ewelinkAccountAuth
      },
      {
        name: 'ewelinkRefreshToken',
        service: ewelinkRefreshToken,
        showInAdmin: true,
        params: {
          ewelinkUserId: 'integer'
        }
      },
      {
        name: 'ewelinkUpdateDevicesForAccount',
        service: ewelinkUpdateDevicesForAccount,
        showInAdmin: true,
        params: {
          ewelinkUserId: 'integer'
        }
      },
      {
        name: 'ewelinkGetSwitchStatus',
        service: ewelinkGetSwitchStatus,
        showInAdmin: true,
        params: {
          did: 'string'
        }
      },
      {
        name: 'ewelinkTurnSwitch',
        service: ewelinkTurnSwitch,
        showInAdmin: true,
        params: {
          on: 'boolean',
          did: 'string',
          resourceId: 'string'
        }
      }
    ]
  }
}
