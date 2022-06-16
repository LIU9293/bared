// host: process.env.MAIL_HOST || 'smtp.exmail.qq.com',
// port: process.env.MAIL_PORT || 465,
// secure: process.env.MAIL_SECURE || true,
// auth: {
//   user: process.env.MAIL_ADDRESS || 'mail@studyroom.com.cn',
//   pass: process.env.MAIL_PASSWORD || 'Lock@1234'
// }

module.exports = {
  tableName: 'email_provider',
  displayName: 'EmailProvider',
  isPluginSchema: true,
  description: 'Email configuration for nodemailer to send emails',
  attributes: {
    providerName: {
      type: "string",
      tableConfig: {
        defaultShow: true
      }
    },
    host: {
      type: "string",
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    port: {
      type: "integer",
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    senderName: {
      type: "string",
      required: false,
    },
    senderAddress: {
      type: 'string',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    senderPassword: {
      type: 'string',
      required: true,
      private: true,
    }
  }
}
