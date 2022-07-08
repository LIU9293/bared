const nodemailer = require('nodemailer')

module.exports = {
  async sendEmail (ctx, { providerId, to, title, body }) {
    const emailProvider = await ctx.queries.get('email_provider', { id: providerId }, { allowPrivate: true })

    if (!emailProvider) {
      throw new Error('Email provider not found')
    }

    const { host, port, senderName, senderAddress, senderPassword } = emailProvider
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: senderAddress,
        pass: senderPassword
      }
    })

    await transporter.sendMail({
      from: senderName ? `"${senderName}" <${senderAddress}>` : senderAddress,
      to,
      subject: title,
      html: body
    })

    return { success: true }
  }
}
