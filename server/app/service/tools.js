const { Service } = require('egg')
const nodemailer = require('nodemailer')

class ToolService extends Service {

  async sendMail(email, subject, text, html) {
    const userEmail = 'project07@163.com'
    const transporter = nodemailer.createTransport({
      host: "smtp.163.com", // 163的服务器地址
      port: 465, // ssl的端口 163参考文档：https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac22dc0e9af8168582a
      secure: true,
      auth: {
        user: userEmail,
        pass: 'AHVUDYGPCROYWUZJ' // 这里是授权码
      }
    })
    const mailOptions = {
      from: userEmail,
      cc: userEmail, // 抄送
      to: email,
      subject,
      text,
      html
    }
    try {
      await transporter.sendMail(mailOptions)
      return true
    } catch (e) {
      console.log('===============sendMailerror=================', e)
      return false
    }
  }
}

module.exports = ToolService