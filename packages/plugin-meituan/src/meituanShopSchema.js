module.exports = {
  tableName: 'meituan_shop',
  displayName: 'MeituanShop',
  isPluginSchema: true,
  attributes: {
    name: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    uuid: {
      type: 'string',
      required: true,
      unique: true,
      tableConfig: {
        defaultShow: true
      }
    },
    meituanAppId: {
      type: 'integer',
      required: true
    },
    city: {
      type: 'string'
    },
    address: {
      type: 'string'
    }
  },
  rowActions: [
    {
      text: 'Get Coupon Info',
      serviceName: 'meituanGetCouponInfo',
      paramsMap: { meituanShopId: 'id' },
      inputParams: { code: 'string' }
    },
    {
      text: 'Verify Code',
      serviceName: 'meituanVerifyCode',
      paramsMap: { meituanShopId: 'id' },
      inputParams: { code: 'string' }
    }
  ]
}
