'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const jwt = app.middleware.jwt({app})
  router.get('/', controller.home.index)

  router.get('/captcha', controller.util.captcha)
  router.get('/sendcode', controller.util.sendcode)

  router.post('/uploadfile', jwt, controller.util.uploadfile)
  router.post('/mergefile', controller.util.mergefile)
  
  // router.post('/mergefile', jwt, controller.util.mergefile)

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { login, register, info } = controller.user
    router.post('/register', register)
    router.post('/login', login)

    // 这个接口需要鉴权
    router.get('/info', jwt, info)
    
  })
}
