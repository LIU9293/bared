module.exports = {
  tableName: 'meituan_app',
  displayName: 'MeituanApp',
  isPluginSchema: true,
  attributes: {
    name: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    appKey: {
      type: 'string',
      required: true,
      unique: true,
      tableConfig: {
        defaultShow: true
      }
    },
    appSecret: {
      type: 'string',
      required: true,
      private: true
    },
    accessToken: {
      type: 'string',
      private: true
    },
    refreshToken: {
      type: 'string',
      private: true
    },
    bid: {
      type: 'string',
    },
    lastUpdateTime: {
      type: 'integer',
    },
    expireIn: {
      type: 'integer',
    },
    refreshCount: {
      type: 'integer',
    }
  }
}
