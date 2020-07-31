'use strict'

const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const BaseController = require('./base')

class UtilController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3
    })
    this.ctx.session.captcha = captcha.text
    console.log('captcha', captcha.text)

    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }

  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    console.log('ctx.query', ctx.query)
    let code = Math.random().toString().slice(2, 6)
    
    ctx.session.emailCode = code
    console.log('emailCode', code)


    const subject = 'Vue验证码'
    const text = ''
    const html = `
      <h2>项目实战</h2>
      <a href="#">${code}</a>
    `

    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    hasSend ? this.message('发送成功') : this.error('发送失败')
  }

  async uploadfile() {
    const { ctx } = this
    console.log('===========upload start===========')
    const { name } = ctx.request.body
    const file = ctx.request.files[0]

    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename)

    this.success({
      url: `/public/${file.filename}`
    })
  }
}

module.exports = UtilController
