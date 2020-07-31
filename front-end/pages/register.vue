<template>
  <div class="register-content">
    <el-form ref="registerForm" :model="form" :rules="rules" class="register-form" label-width="100px">
      <el-form-item class="logo">
        <img src="/favicon.ico" alt="">
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" label="验证码">
        <div class="register-code">
          <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
          <img :src="captchaUrl" alt="" @click="updateCaptchaUrl()">
        </div>
      </el-form-item>
      <el-form-item prop="nickname" label="昵称">
        <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input type="password" v-model="form.repassword" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="handleRegister">注 册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  layout: 'login',
  data() {
    return {
      captchaUrl: '',
      form: {
        password: '123678_a',
        repassword: '123678_a',
        nickname: 'nickname',
        email: '1067489058@qq.com',
        captcha: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确邮箱格式' }
        ],
        captcha: [
          { required: true, message: '请输入验证码' }
        ],
        nickname: [
          { required: true, message: '请输入昵称' }
        ],
        // password: [
          // { required: true, pattern: /^[\w_-]{6, 12}$/, message: '请输入6-12位的密码' }
        // ],
        repassword: [
          { required: true, message: '请再次输入密码' },
          { validator: (rule, value, callback) => {
            if (value !== this.form.password) {
              callback(new Error('两次密码输入不一致'))
            }
            callback()
          }}
        ]
      }
    }
  },
  mounted() {
    this.updateCaptchaUrl()
    // this.handleRegister()
    // this.getCaptcha()
  },
  methods: {
    updateCaptchaUrl() {
      this.captchaUrl = '/api/captcha?_t=' + new Date().getTime()
    },
    async getCaptcha() {
      console.log('getCaptcha')
      let res = await this.$http.get('/captcha').then(res => {
        console.log(res)
      }) 
    },
    handleRegister() {
      console.log('handleRegister')
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          let obj = {
            email: this.form.email,
            nickname: this.form.nickname,
            password: md5(this.form.password),
            captcha: this.form.captcha
          }
          let res = await this.$http.post('/user/register', obj)
          if (res.code === 0) {
            this.$alert('注册成功', '成功', {
              confirmButtonText: '去登陆',
              callback: () => {
                this.$router.push('/login')
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message || 'message- 注册失败////'
            })
          }
        } else {
          console.log('校验失败////')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-content {
  margin-top: 200px;
  .logo {
    text-align: center;
  }
  .register-form {
    width: 500px;
    margin: 0 auto;
  }
  .register-code {
    display: flex;
    img {
      cursor: pointer;
    }
  }
}
</style>