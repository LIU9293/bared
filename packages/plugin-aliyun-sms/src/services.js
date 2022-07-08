const Dysmsapi = require('@alicloud/dysmsapi20170525')
const { default: Client, SendSmsRequest, QuerySmsTemplateListRequest, QuerySmsSignListRequest } = Dysmsapi
const OpenApi = require('@alicloud/openapi-client').Config

async function getOpenApiClient (ctx, { developerId }) {
  const aliyunDeveloper = await ctx.queries.get('aliyun_sms_developer', { id: developerId }, { allowPrivate: true })
  const { accessKeyId, accessKeySecret, endpoint } = aliyunDeveloper
  const config = new OpenApi({ accessKeyId, accessKeySecret, endpoint })
  const client = new Client(config)
  return client
}

module.exports = {
  async getTemplatesAndUpdate (ctx, { developerId, page = 1 }) {
    const pageSize = 50
    const client = await getOpenApiClient(ctx, { developerId })
    const request = new QuerySmsTemplateListRequest({
      pageIndex: page,
      pageSize
    })

    const res = await client.querySmsTemplateList(request)
    const { smsTemplateList } = res.body

    for (const template of smsTemplateList) {
      const { auditStatus, templateCode, templateContent, templateName } = template
      await ctx.queries.upsert('aliyun_sms_template', { templateCode }, {
        auditStatus,
        templateCode,
        templateContent,
        templateName,
        developerId
      })
    }

    return smsTemplateList
  },

  async getSignAndUpdate (ctx, { developerId, page = 1 }) {
    const pageSize = 50
    const client = await getOpenApiClient(ctx, { developerId })
    const request = new QuerySmsSignListRequest({
      pageIndex: page,
      pageSize
    })

    const res = await client.querySmsSignList(request)
    const { smsSignList } = res.body

    for (const sign of smsSignList) {
      const { auditStatus, signName, orderId, businessType } = sign
      await ctx.queries.upsert('aliyun_sms_sign', { orderId }, {
        auditStatus,
        businessType,
        signName,
        developerId,
        orderId
      })
    }

    return smsSignList
  },

  async sendSms (ctx, { signId, templateId, phoneNumber, templateParams = {} }) {
    const sign = await ctx.queries.get('aliyun_sms_sign', { id: signId })
    const template = await ctx.queries.get('aliyun_sms_template', { id: templateId })

    const client = await getOpenApiClient(ctx, { developerId: sign.developerId })
    const smsRequest = new SendSmsRequest({
      phoneNumbers: phoneNumber,
      signName: sign.signName,
      templateCode: template.templateCode,
      templateParam: JSON.stringify(templateParams)
    })

    const res = await client.sendSms(smsRequest)
    return res
  }
}
