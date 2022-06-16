module.exports = {
  tableName: 'wechat_app',
  displayName: 'WechatApp',
  isPluginSchema: true,
  attributes: {
    name: {
      type: "string",
      required: true,
      tableConfig: {
        showAsAvatar: false,
        defaultShow: true
      }
    },
    appId: {
      type: 'string',
      required: true,
      tableConfig: {
        showAsAvatar: false,
        defaultShow: true
      }
    },
    appSecret: {
      type: 'string',
      default: '',
      required: false,
      private: true,
      tableConfig: {
        defaultShow: false
      }
    }
  }
}
