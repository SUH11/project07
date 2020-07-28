'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/captcha', controller.util.captcha)

  // router.post('/user/register', controller.user.register)

  // router.group({name: 'user', prefix: '/user'} router => {
  //   const { register } = controller.user

  //   router.post('register', '/register', register)
  // })

  // console.log('router', router)


  router.group({ name: 'user', prefix: '/user' }, router => {
    // router-name: home::post
    const { login, register } = controller.user
    router.post('/register', register)
    router.post('/login', login)
    // router.post('post', '/test/:id', controller.home.t1);
  })



  // router.group({ name: 'home::', prefix: '/pre' }, router => {
  //   // router-path: /pre/test, middlewares: m1, m2
  //   // router-path: /pre/test2, middlewares: m1, m2 ⚠️这里🈶️group 设置的属性哦
  //   router.post('/test', controller.user.register)
  // })
}
