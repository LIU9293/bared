module.exports = {
  tableName: 'email_provider',
  displayName: 'Email Provider',
  attributes: {
    host: {
      type: 'string'
    },
    port: {
      type: 'integer'
    },
    secure: {
      type: 'boolean'
    },
    username: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    defaultAddress: {
      type: 'string'
    }
  }
}
