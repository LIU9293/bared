module.exports = {
  tableName: 'aqara_developer',
  displayName: 'AqaraDeveloper',
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
    },
    keyId: {
      type: 'string',
      required: true,
      private: true
    }
  },
  rowActions: [
    {
      text: 'Send Auth Code',
      serviceName: 'aqaraAccountAuth',
      paramsMap: { aqaraDeveloperId: 'id' },
      inputParams: { account: 'string' }
    },
    {
      text: 'Verify Auth Code',
      serviceName: 'aqaraVerifyAuthCode',
      paramsMap: { aqaraDeveloperId: 'id' },
      inputParams: { account: 'string', authCode: 'string' }
    }
  ]
}
