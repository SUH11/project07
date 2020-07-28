'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/captcha', controller.util.captcha)
  router.post('/user/register', controller.user.register)

  // 路由管理

  // router.group({ name: 'user', prefix: '/user' }, router => {
  //   const { info, register, login, verify } = controller.user

  //   router.post('register', register)
  //   router.get('info', info)
  //   router.get('login', login)
  //   router.post('verify', verify)
  // })

  router.group({name: 'user', prefix: '/user'}, router => {
    const { info, register, login, verify } = controller.user
    router.post('/register', register)
  })

}
