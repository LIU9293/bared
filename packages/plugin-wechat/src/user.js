module.exports = {
  openId: {
    type: 'string',
    default: '',
    required: false,
    unique: true
  },
  unionId: {
    type: 'string',
    default: '',
    required: false,
    unique: true
  },
  sessionKey: {
    type: 'string',
    default: '',
    required: false,
    unique: false
  },
  location: {
    type: 'string',
    default: '',
    required: false,
    unique: false
  }
}
