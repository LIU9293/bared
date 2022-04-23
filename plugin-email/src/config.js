
function extendUserAttributes (attr) {
  return {
    ...attr,
    email: {
      type: 'string',
      default: '',
      required: false,
      unique: true
    },
    emailConfirmed: {
      type: 'boolean',
      default: false
    },
    confirmEmailToken: {
      type: 'string',
      default: '',
      required: false,
      unique: true
    }
  }
}

module.exports = extendUserAttributes
