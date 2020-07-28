const BaseController = require('./base')

const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' }, 
  password: { type: 'string' }, 
  email: { type: 'string' }
}

class UserController extends BaseController {
  async login() {

  }

  async register() {
    const { ctx } = this
    try {
      ctx.validate(createRule)
    } catch (e) {
      console.log(e)
      return this.error('参数校验失败', -1, e.errors)
    }

    
  }

  async verify() {

  }

  async info() {

  }
}