// 也可以用egg-jwt
const jwt = require('jsonwebtoken')

module.exports = ({app}) => {
  return async function verify(ctx, next) {
    console.log('===========verify token=========')
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: -666,
        message: '用户没有登陆'
      }
      return
    }

    const token = ctx.request.header.authorization.replace('Bearer ', '')
    console.log('==========token=========', token)
    try {
      const res = await jwt.verify(token, app.config.jwt.secret)
      console.log('res====', res)
      ctx.state.email = res.email
      ctx.state._id = res._id
      await next()
    } catch(e) {
      console.log('===========verify error=========')
      console.log(e)
      if (e.name === 'TokenExpiredError') {
        ctx.body = {
          code: -666,
          message: '登陆过期'
        }
      } else {
        ctx.body = {
          code: -1,
          message: '用户信息出错'
        }
      }
    }
  }
}