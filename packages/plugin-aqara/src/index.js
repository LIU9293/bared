const aqaraDeveloperSchema = require('./aqaraDeveloperSchema')
const aqaraUserSchema = require('./aqaraUserSchema')
const aqaraDeviceSchema = require('./aqaraDeviceSchema')
const {
  aqaraAccountAuth,
  aqaraVerifyAuthCode,
  aqaraUpdateDevicesForAccount,
  aqaraGetDeviceResoureDetail,
  aqaraGetDeviceResoureValue,
  aqaraTurnSwitch,
  aqaraGetDeviceResoures,
  aqaraGetSwitchStatus
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
        name: 'aqaraAccountAuth',
        service: aqaraAccountAuth,
        showInAdmin: true,
        params: {
          aqaraDeveloperId: 'integer',
          account: 'string'
        }
      },
      {
        name: 'aqaraVerifyAuthCode',
        service: aqaraVerifyAuthCode,
        showInAdmin: true,
        params: {
          aqaraDeveloperId: 'integer',
          account: 'string',
          authCode: 'string'
        }
      },
      {
        name: 'aqaraUpdateDevicesForAccount',
        service: aqaraUpdateDevicesForAccount,
        showInAdmin: true,
        params: {
          aqaraUserId: 'integer'
        }
      },
      {
        name: 'aqaraGetDeviceResoures',
        service: aqaraGetDeviceResoures,
        showInAdmin: false,
        params: {
          did: 'string'
        }
      },
      {
        name: 'aqaraGetDeviceResoureDetail',
        service: aqaraGetDeviceResoureDetail,
        showInAdmin: false,
        params: {
          did: 'string',
          resourceId: 'string'
        }
      },
      {
        name: 'aqaraGetDeviceResoureValue',
        service: aqaraGetDeviceResoureValue,
        showInAdmin: false,
        params: {
          did: 'string',
          resourceId: 'string'
        }
      },
      {
        name: 'aqaraGetSwitchStatus',
        service: aqaraGetSwitchStatus,
        showInAdmin: true,
        params: {
          did: 'string'
        }
      },
      {
        name: 'aqaraTurnSwitch',
        service: aqaraTurnSwitch,
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
