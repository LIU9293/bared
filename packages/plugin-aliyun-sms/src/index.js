const aliyunSmsDeveloperSchema = require('./aliyunSmsDeveloperSchema')
const aliyunSmsTemplateSchema = require('./aliyunSmsTemplateSchema')
const aliyunSmsSignSchema = require('./aliyunSmsSignSchema')
const {
  getTemplatesAndUpdate,
  getSignAndUpdate
} = require('./services')

module.exports = () => {
  return {
    pluginName: 'aliyun-sms',
    extendUserSchema: schema => schema,
    schemas: [
      aliyunSmsDeveloperSchema,
      aliyunSmsTemplateSchema,
      aliyunSmsSignSchema
    ],
    routers: [],
    middlewares: [],
    services: [
      {
        name: 'getTemplatesAndUpdate',
        service: getTemplatesAndUpdate,
        params: {
          developerId: 'integer'
        }
      },
      {
        name: 'getSignAndUpdate',
        service: getSignAndUpdate,
        params: {
          developerId: 'integer'
        }
      },
      {
        name: 'sendSms',
        service: sendSms,
        params: {
          signId: 'integer',
          templateId: 'integer',
          phoneNumber: 'string',
          templateParams: 'json'
        }
      }
    ]
  }
}
