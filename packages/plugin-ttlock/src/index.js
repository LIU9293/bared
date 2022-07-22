const ttlockUserSchema = require('./ttlockUserSchema')
const ttlockDeveloperSchema = require('./ttlockDeveloperSchema')
const ttlockLockSchema = require('./ttlockLockSchema')
// const routes = require('./router')

const {
  fetchTtlockAccessToken,
  refreshTtlockToken,
  getLocksAndUpdate,
  refreshAllLocks,
  getLockByLockId,
  getExpireTime
} = require('./services')

module.exports = () => {
  return {
    pluginName: 'ttlock',
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
          ttlockUserId: 'integer'
        }
      },
      {
        name: 'refreshAllLocks',
        service: refreshAllLocks,
        params: {
          developerId: 'integer'
        }
      },
      {
        name: 'getLockByLockId',
        service: getLockByLockId,
        params: {
          lockId: 'string'
        }
      },
      {
        name: 'getExpireTime',
        service: getExpireTime,
        params: {
          id: 'integer'
        }
      }
    ]
  }
}
