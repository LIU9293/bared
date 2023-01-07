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
    branch: {
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
      text: 'Fetch Coupons',
      serviceName: 'meituanFetchCoupons',
      paramsMap: { meituanShopId: 'id' }
    },
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
    },
    {
      text: 'Traffic',
      serviceName: 'meituanGetRoomTraffic',
      paramsMap: { meituanShopId: 'id' },
      inputParams: {
        startDate: 'string',
        endDate: 'string'
      }
    },
    {
      text: 'Consumption',
      serviceName: 'meituanGetRoomConsumption',
      paramsMap: { meituanShopId: 'id' },
      inputParams: { dateType: 'integer' }
    },
  ]
}
