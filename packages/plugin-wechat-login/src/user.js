module.exports = {
  wechatAppid: {
    type: 'string',
    default: '',
    unique: false
  },
  wechatOpenid: {
    type: 'string',
    default: '',
    required: false,
    private: true
  },
  wechatUnionid: {
    type: 'string',
    default: '',
    required: false,
    private: true
  },
  wechatSessionKey: {
    type: 'string',
    default: '',
    required: false,
    private: true
  }
}
