module.exports = {
  wechatAppid: {
    type: 'string',
    default: '',
    unique: false,
  },
  wechatOpenid: {
    type: 'string',
    default: '',
    required: false,
    unique: true,
    private: true
  },
  wechatUnionid: {
    type: 'string',
    default: '',
    required: false,
    unique: true,
    private: true
  },
  wechatSessionKey: {
    type: 'string',
    default: '',
    required: false,
    unique: false,
    private: true
  }
}
