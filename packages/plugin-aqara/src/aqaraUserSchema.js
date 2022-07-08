module.exports = {
  tableName: 'aqara_user',
  displayName: 'AqaraUser',
  isPluginSchema: true,
  attributes: {
    name: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    account: {
      type: 'string',
      required: true
    },
    developerId: {
      type: 'integer',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    accessToken: {
      type: 'string'
    },
    refreshToken: {
      type: 'string'
    },
    openId: {
      type: 'string'
    },
    expiresIn: {
      type: 'bigint'
    }
  }
}
