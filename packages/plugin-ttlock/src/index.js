const ttlockUserSchema = require('./ttlockUserSchema')
const ttlockDeveloperSchema = require('./ttlockDeveloperSchema')
const ttlockLockSchema = require('./ttlockLockSchema')

const {
  fetchTtlockAccessToken,
  refreshTtlockToken,
  getLocksAndUpdate
} = require('./services')

module.exports = () => {
  return {
    extendUserSchema: schema => schema,
    schemas: [
      ttlockUserSchema,
      ttlockDeveloperSchema,
      ttlockLockSchema
    ],
    routers: [],
    middlewares: [],
    services: [
      {
        name: 'fetchTtlockAccessToken',
        service: fetchTtlockAccessToken,
        params: {
          ttlockUserId: 'integer'
        }
      },
      {
        name: 'refreshTtlockToken',
        service: refreshTtlockToken,
        params: {
          ttlockUserId: 'integer'
        }
      },
      {
        name: 'getLocksAndUpdate',
        service: getLocksAndUpdate,
        params: {
          ttlockUserId: 'integer',
          page: 'integer',
          pageSize: 'integer'
        }
      }
    ]
  }
}
