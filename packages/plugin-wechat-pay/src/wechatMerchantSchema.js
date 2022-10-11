module.exports = {
  tableName: 'wechat_merchant',
  displayName: 'WechatMerchant',
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
    merchantId: {
      type: 'string',
      required: true,
      tableConfig: {
        showAsAvatar: false,
        defaultShow: true
      }
    },
    merchantKey: {
      type: 'text',
      default: '',
      required: false,
      private: true,
      tableConfig: {
        defaultShow: false
      }
    },
    useV3Api: {
      type: 'boolean',
      default: true,
      required: true,
      tableConfig: {
        defaultShow: false
      }
    },
    merchantCert: {
      type: 'text',
      default: '',
      required: false,
      private: true,
      tableConfig: {
        defaultShow: false
      }
    },
    merchantPrivateKey: {
      type: 'string',
      default: '',
      required: false,
      private: true,
      tableConfig: {
        defaultShow: false
      }
    },
    parentMerchantId: {
      type: 'integer',
      required: false
    }
  }
}
