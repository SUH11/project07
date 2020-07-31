const md5 = require('md5')
const jwt = require('jsonwebtoken')
const BaseController = require('./base')

const HashSalt = ':::learningVueProject'
const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' }, 
  password: { type: 'string' }, 
  captcha: { type: 'string' }
}

class UserController extends BaseController {
  /**
   * 登陆
   * @params email password captcha
  */
  async login() {
    const { ctx, app } = this
    const { email, captcha, password, emailCode } = ctx.request.body
    // 校验验证码
    // if (captcha && captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
    //   this.error('验证码错误')
    // } 
    // 校验邮箱验证码
    // if (emailCode.toUpperCase() !== ctx.session.emailCode.toUpperCase()) {
    //   this.error('邮箱验证码错误')
    // }
    const user = await this.ctx.model.User.findOne({
      email,
      password: md5(password + HashSalt)
    })
    if (!user) {
      return this.error('邮箱或密码错误')
    }
    const token = jwt.sign({
      _id: user._id,
      email
    }, app.config.jwt.secret, {
      expiresIn: '10h'
    })
    console.log('================login token===========', token)
    this.success({
      token,
      email,
      nickname: user.nickname
    })
  }

  /**
   * 注册
   * @params email password nickname captcha
  */
  async register() {
    const { ctx } = this
    try {
      ctx.validate(createRule)
    } catch (e) {
      console.log(e)
      return this.error('参数校验失参数校验失败参数校验失败参数校验失败败', -1, e.errors)
    }
    const { email, nickname, password, captcha } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    if (await this.checkEmail(email)) {
      return this.error('邮箱重复')
    }
    const res = await ctx.model.User.create({
      email,
      nickname,
      password: md5(password + HashSalt) // 加密
    })
    if (res._id) {
      return this.message('注册成功')
    }
  }

  async checkEmail(email) {
    return await this.ctx.model.User.findOne({email})
  }

  async verify() {

  }

  async info() {
    const { ctx } = this

    let user = this.checkEmail()
    this.success(user)
  }
}

module.exports = UserController