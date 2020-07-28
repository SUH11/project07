const BaseController = require('./base')

const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' }, 
  password: { type: 'string' }, 
  email: { type: 'string' }
}

class UserController extends BaseController {
  async login() {
    this.success('login success......')
  }

  async register() {
    const { ctx } = this
    try {
      ctx.validate(createRule)
    } catch (e) {
      console.log(e)
      return this.error('参数校验失参数校验失败参数校验失败参数校验失败败', -1, e.errors)
    }

    this.success('访问成功了！！！')
    
  }

  async verify() {

  }

  async info() {

  }
}

module.exports = UserController