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
    appId: {
      type: 'string',
      required: true,
      tableConfig: {
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
      type: 'string',
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
      type: 'string',
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
    }
  }
}
