
module.exports = {
  tableName: 'meituan_coupon',
  displayName: 'MeituanCoupon',
  isPluginSchema: true,
  attributes: {
    title: { type: 'string', tableConfig: { defaultShow: true } },
    shopId: { type: 'integer' },
    dealId: { type: 'string' },
    dealGroupId: { type: 'string' },
    price: { type: 'number' }
  },
  rowActions: [

  ]
}
