module.exports = {
  tableName: 'ewelink_developer',
  displayName: 'EwelinkDeveloper',
  isPluginSchema: true,
  attributes: {
    name: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    appId: {
      type: 'string',
      required: true,
      unique: true,
      tableConfig: {
        defaultShow: true
      }
    },
    appKey: {
      type: 'string',
      required: true,
      private: true
    }
  },
  rowActions: [
    {
      text: 'get auth url',
      serviceName: 'ewelinkGenerateAuthUrl',
      inputParams: { ewelinkDeveloperId: 'integer', id: 'integer' }
    }
  ]
}
