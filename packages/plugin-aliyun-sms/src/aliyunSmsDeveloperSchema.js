module.exports = {
  tableName: 'aliyun_sms_developer',
  displayName: 'AliyunSmsDeveloper',
  isPluginSchema: true,
  attributes: {
    name: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    accessKeyId: {
      type: 'string',
      required: true,
      unique: true,
      tableConfig: {
        defaultShow: true
      }
    },
    accessKeySecret: {
      type: 'string',
      required: true,
      private: true
    },
    endpoint: {
      type: 'string',
      required: true
    },
  }
}
