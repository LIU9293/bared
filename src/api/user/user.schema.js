module.exports = {
  tableName: 'user',
  displayName: 'User',
  attributes: {
    name: { type: 'string', default: '', required: false },
    avatar: {
      type: 'string',
      default: '',
      required: false,
      tableConfig: {
        showAsAvatar: true
      }
    },
    username: { type: 'string', default: '', required: false, unique: true },
    password: { type: 'string', default: '', required: false },
    auth_type: {
      required: true,
      type: 'enum',
      enum: ['basic', 'developer']
    }
  }
}
