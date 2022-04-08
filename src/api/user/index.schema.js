module.exports = {
  tableName: 'user',
  displayName: '用户',
  attributes: {
    name: { type: 'string', default: '', required: false },
    avatar: { type: 'string', default: '', required: false },
    age: { type: 'integer' },
    auth_type: {
      required: true,
      type: 'enum',
      enum: ['basic', 'developer']
    }
  }
}
