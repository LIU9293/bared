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
      serviceName: 'aqaraGetSwitchStatus',
      paramsMap: { did: 'did' }
    },
    {
      text: 'Turn Switch 1',
      serviceName: 'aqaraTurnSwitch',
      paramsMap: { did: 'did' },
      fixedParams: { resourceId: '4.1.85' },
      inputParams: { on: 'boolean' }
    },
    {
      text: 'Turn Switch 2',
      serviceName: 'aqaraTurnSwitch',
      paramsMap: { did: 'did' },
      fixedParams: { resourceId: '4.2.85' },
      inputParams: { on: 'boolean' }
    }
  ]
}
