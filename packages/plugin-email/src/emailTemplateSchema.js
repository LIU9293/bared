module.exports = {
  tableName: 'email_template',
  displayName: 'EmailTemplate',
  isPluginSchema: true,
  description: 'Email templates',
  attributes: {
    templateName: {
      type: 'string',
      tableConfig: {
        defaultShow: true
      }
    },
    template: {
      type: 'text',
      required: true
    }
  }
}
