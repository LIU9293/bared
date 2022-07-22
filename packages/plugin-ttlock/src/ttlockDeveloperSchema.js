module.exports = {
  tableName: 'ttlock_developer',
  displayName: 'TtlockDeveloper',
  isPluginSchema: true,
  attributes: {
    clientId: {
      type: 'string',
      required: true,
      unique: true,
      tableConfig: {
        defaultShow: true
      }
    },
    clientSecret: {
      type: 'string',
      required: true,
      private: true
    },
    developerEmail: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    }
  },
  rowActions: [
    {
      text: 'Refresh all locks',
      serviceName: 'refreshAllLocks',
      paramsMap: { developerId: 'id' }
    }
  ]
}
