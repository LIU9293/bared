module.exports = {
  tableName: 'ewelink_user',
  displayName: 'EwelinkUser',
  description: '所有的Ewelink账户',
  isPluginSchema: true,
  attributes: {
    developerId: { type: 'integer', required: true },
    appId: { type: 'integer', required: true },
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    atExpiredTime: { type: 'bigint' },
    rtExpiredTime: { type: 'bigint' },
    memo: { type: 'string' }
  },
  rowActions: [
    {
      text: 'Get Auth Link',
      serviceName: 'ewelinkGenerateAuthUrl',
      paramsMap: { ewelinkDeveloperId: 'developerId', id: 'appId' }
    },
    {
      text: 'Refresh Token',
      serviceName: 'ewelinkRefreshToken',
      paramsMap: { ewelinkUserId: 'id' }
    },
    {
      text: 'Refresh Devices',
      serviceName: 'ewelinkUpdateDevicesForAccount',
      paramsMap: { ewelinkUserId: 'id' }
    }
  ]
}
