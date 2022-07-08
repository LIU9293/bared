module.exports = {
  tableName: 'aqara_device',
  displayName: 'AqaraDevice',
  isPluginSchema: true,
  attributes: {
    aqaraUserId: {
      type: 'integer',
      required: true
    },
    deviceName: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    did: {
      type: 'string',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    positionId: {
      type: 'string'
    },
    parentDid: {
      type: 'string'
    },
    model: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    state: {
      type: 'integer',
      tableConfig: {
        defaultShow: true
      }
    }
  }
}
