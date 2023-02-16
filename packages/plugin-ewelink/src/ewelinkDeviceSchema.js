module.exports = {
  tableName: 'ewelink_device',
  displayName: 'EwelinkDevice',
  description: '所有的Ewelink设备',
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
    positionId: { type: 'string' },
    parentDid: { type: 'string' },
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
  },
  rowActions: [
    {
      text: 'Get Switch State',
      serviceName: 'ewelinkGetSwitchStatus',
      paramsMap: { did: 'did' }
    }
  ]
}
