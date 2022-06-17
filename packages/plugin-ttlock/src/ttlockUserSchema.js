module.exports = {
  tableName: 'ttlock_user',
  displayName: 'TtlockUser',
  isPluginSchema: true,
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
      tableConfig: {
        showAsAvatar: false,
        defaultShow: true
      }
    },
    password: {
      type: 'string',
      required: true,
      private: true
    },
    developerId: {
      type: 'integer',
      required: true
    },
    accessToken: {
      type: 'string',
      required: false,
      private: true
    },
    refreshToken: {
      type: 'string',
      required: false,
      private: true
    },
    uid: {
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
      required: false
    }
  }
}
