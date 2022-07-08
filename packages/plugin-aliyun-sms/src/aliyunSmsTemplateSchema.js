module.exports = {
  tableName: 'aliyun_sms_template',
  displayName: 'AliyunSmsTemplate',
  isPluginSchema: true,
  attributes: {
    developerId: {
      type: 'integer',
      required: true
    },
    templateName: {
      type: 'string',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    templateCode: {
      type: 'string',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    templateContent: {
      type: 'string'
    },
    auditStatus: {
      type: 'string'
    }
  }
}
