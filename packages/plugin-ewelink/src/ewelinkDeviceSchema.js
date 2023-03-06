module.exports = {
  tableName: 'ewelink_device',
  displayName: 'EwelinkDevice',
  description: '所有的Ewelink设备',
  isPluginSchema: true,
  attributes: {
    ewelinkUserId: {
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
    model: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    }
  },
  rowActions: [
    {
      text: 'Get Switch State',
      serviceName: 'ewelinkGetDeviceDetail',
      paramsMap: { ewelinkDeviceId: 'id' }
    }
  ]
}
