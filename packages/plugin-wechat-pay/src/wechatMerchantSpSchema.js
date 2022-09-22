module.exports = {
  tableName: 'wechat_merchant_sp',
  displayName: 'WechatMerchantSp',
  isPluginSchema: true,
  attributes: {
    name: {
      type: 'string',
      required: true,
      tableConfig: {
        showAsAvatar: false,
        defaultShow: true
      }
    },
    spAppId: {
      type: 'string',
      required: false,
      tableConfig: {
        defaultShow: true
      }
    },
    spMchId: {
      type: 'string',
      required: true,
      private: true
    },
    publicKey: {
      type: 'text',
      default: '',
      required: false,
      private: true
    },
    privateKey: {
      type: 'text',
      default: '',
      required: false,
      private: true
    },
    serialNo: {
      type: 'string',
      default: '',
      required: false,
      private: true
    },
    password: {
      type: 'string',
      default: '',
      private: true
    }
  }
}
