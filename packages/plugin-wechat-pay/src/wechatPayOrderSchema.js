module.exports = {
  tableName: 'wechat_pay_order',
  displayName: 'wechatPayOrder',
  isPluginSchema: true,
  attributes: {
    orderId: {
      type: "string",
      required: true,
      unique: true,
      tableConfig: {
        showAsAvatar: false,
        defaultShow: true
      }
    },
    userId: {
      type: "integer",
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    amount: {
      type: "integer",
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    merchant: {
      type: 'integer',
      required: true
    },
    success: {
      type: 'boolean',
      required: true,
      default: false,
      tableConfig: {
        defaultShow: true
      }
    },
    txid: {
      type: 'string',
      required: false,
      default: ''
    },
    bank: {
      type: 'string',
      required: false,
      default: ''
    },
    callbackServiceJson: {
      type: 'string',
      required: false,
      default: ''
    }
  }
}
