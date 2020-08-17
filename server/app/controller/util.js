'use strict'

const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const BaseController = require('./base')
const path = require('path')

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

  async mergefile() {
    const { ctx } = this
    const { ext, size, hash } = ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    await ctx.service.tools.mergeFile(filePath, hash, size)
    this.success({
      url: `/public/${hash}.${ext}`
    })
  }

  async uploadfile() {
    const { ctx } = this
    console.log('===========upload start=======================================')
    const { name, hash } = ctx.request.body
    const file = ctx.request.files[0]
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)

    console.log('name, hash', name, hash)

    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath)
    }

    await fse.move(file.filepath, `${chunkPath}/${name}`)

    // this.success({
    //   url: `/public/${file.filename}`
    // })
    this.message('切片上传成功！')
  }
}

module.exports = UtilController
