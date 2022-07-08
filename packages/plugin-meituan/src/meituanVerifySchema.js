module.exports = {
  tableName: 'meituan_verify',
  displayName: 'MeituanVerify',
  isPluginSchema: true,
  attributes: {
    meituanShopId: {
      type: 'integer',
      tableConfig: {
        defaultShow: true
      }
    },
    couponCode: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    couponTitle: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    userId: {
      type: 'integer'
    }
  }
}
