module.exports = {
  tableName: 'user',
  displayName: 'User',
  attributes: {
    name: {
      type: 'string',
      default: '',
      required: false,
      tableConfig: {
        defaultShow: true
      }
    },
    avatar: {
      type: 'string',
      default: '',
      required: false,
      tableConfig: {
        showAsAvatar: true,
        defaultShow: true
      }
    },
    gender: {
      type: "integer",
      default: 0,
      required: false,
      tableConfig: {
        showAsAvatar: false,
        defaultShow: false
      }
    },
    username: {
      type: 'string',
      default: '',
      required: false,
      unique: true
    },
    password: {
      type: 'string',
      default: '',
      required: false,
      private: true
    },
    auth_type: {
      required: true,
      type: 'enum',
      enum: ['basic', 'developer']
    }
  }
}
