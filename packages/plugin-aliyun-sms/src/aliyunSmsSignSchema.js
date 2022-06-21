module.exports = {
  tableName: 'aliyun_sms_sign',
  displayName: 'AliyunSmsSign',
  isPluginSchema: true,
  attributes: {
    developerId: {
      type: 'integer',
      required: true,
    },
    signName: {
      type: 'string',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    orderId: {
      type: 'string',
    },
    businessType: {
      type: 'string',
    },
    auditStatus: {
      type: 'string'
    }
  }
}
