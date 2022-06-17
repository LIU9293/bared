module.exports = {
  tableName: 'ttlock_lock',
  displayName: 'TtlockLock',
  isPluginSchema: true,
  attributes: {
    name: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    ttlockUserId: {
      type: 'integer',
      required: true
    },
    lockId: {
      type: 'string',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    lockData: {
      type: 'text'
    },
    electricQuantity: {
      type: 'integer'
    }
  }
}
