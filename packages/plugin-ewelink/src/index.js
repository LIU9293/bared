const ewelinkDeveloperSchema = require('./ewelinkDeveloperSchema')
const ewelinkUserSchema = require('./ewelinkUserSchema')
const ewelinkDeviceSchema = require('./ewelinkDeviceSchema')
const {
  ewelinkGenerateAuthUrl,
  ewelinkAccountAuth,
  ewelinkUpdateDevicesForAccount,
  ewelinkTurnSwitch,
  ewelinkRefreshToken,
  ewelinkGetDeviceDetail
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
        name: 'ewelinkGetDeviceDetail',
        service: ewelinkGetDeviceDetail,
        showInAdmin: true,
        params: {
          ewelinkDeviceId: 'integer'
        }
      },
      {
        name: 'ewelinkTurnSwitch',
        service: ewelinkTurnSwitch,
        showInAdmin: true,
        params: {
          on: 'boolean',
          index: 'integer',
          ewelinkDeviceId: 'integer'
        }
      }
    ]
  }
}
