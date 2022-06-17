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
    }
  }
}
