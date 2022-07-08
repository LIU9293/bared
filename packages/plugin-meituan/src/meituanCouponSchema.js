
module.exports = {
  tableName: 'meituan_coupon',
  displayName: 'MeituanCoupon',
  isPluginSchema: true,
  attributes: {
    title: { type: 'string', tableConfig: { defaultShow: true } },
    meituanShopId: { type: 'integer' },
    dealId: { type: 'bigint' },
    dealGroupId: { type: 'bigint' },
    price: { type: 'float' },
    saleStatus: { type: 'integer' }
  },
  rowActions: []
}
