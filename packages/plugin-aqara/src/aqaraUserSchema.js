module.exports = {
  tableName: 'aqara_user',
  displayName: 'AqaraUser',
  description: '所有的Aqara账户，通过短信授权，默认token有效期1年',
  isPluginSchema: true,
  attributes: {
    name: { type: 'string', tableConfig: { defaultShow: true } },
    account: { type: 'string', required: true },
    developerId: { type: 'integer', required: true },
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    openId: { type: 'string' },
    expiresIn: { type: 'bigint' }
  },
  rowActions: [
    {
      text: 'Refresh Devices',
      serviceName: 'aqaraUpdateDevicesForAccount',
      paramsMap: { aqaraUserId: 'id' }
    }
  ]
}
