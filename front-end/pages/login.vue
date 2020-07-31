<template>
  <div class="login-content">
    <el-form ref="loginForm" :model="form" :rules="rules" class="login-form" label-width="100px">
      <el-form-item class="logo">
        <img src="/favicon.ico" alt="">
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" label="验证码">
        <div class="login-code">
          <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
          <img :src="captchaUrl" alt="" @click="updateCaptchaUrl()">
        </div>
      </el-form-item>
      <el-form-item prop="emailCode" label="邮箱验证码">
        <div class="login-code">
          <el-input v-model="form.emailCode" placeholder="请输入验证码"></el-input>
          <el-button class="email-code" type="primary" :disabled="sendTimer > 0" @click="sendEmailCode">{{sendText}}</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="handleLogin">登 陆</el-button>
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
      sendTimer: 0,
      timer: null,
      captchaUrl: '',
      form: {
        password: '123678_a',
        email: '1067489058@qq.com',
        captcha: '',
        emailCode: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确邮箱格式' }
        ],
        // captcha: [
        //   { required: true, message: '请输入验证码' }
        // ],
        // emailCode: [
        //   { required: true, message: '请输入邮箱验证码' }
        // ],
        // password: [
        //   { required: true, pattern: /^[\w_-]{6, 12}$/, message: '请输入6-12位的密码' }
        // ]
      }
    }
  },
  mounted() {
    this.updateCaptchaUrl()
  },
  computed: {
    sendText() {
      return this.sendTimer > 0 ? `${this.sendTimer}s后发送` : '发送'
    }
  },
  methods: {
    async sendEmailCode() {
      await this.$http.get(`/sendcode?email=${this.form.email}`)
      this.sendTimer = 10
      this.timer = setInterval(() => {
        if (this.sendTimer === 0) {
          clearInterval(this.timer)
        } else {
          this.sendTimer -= 1
        }
      }, 1000)
    },
    updateCaptchaUrl() {
      this.captchaUrl = '/api/captcha?_t=' + new Date().getTime()
    },
    handleLogin() {
      console.log('handleLogin')
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          let obj = {
            email: this.form.email,
            password: md5(this.form.password),
            captcha: this.form.captcha,
            emailCode: this.form.emailCode
          }
          let res = await this.$http.post('/user/login', obj)
          if (res.code === 0) {
            // this.$alert('登陆成功', '成功', {
            //   confirmButtonText: '去登陆',
            //   callback: () => {
            //     this.$router.push('/login')
            //   }
            // })
            console.log('res', res)
            localStorage.setItem('token', res.data.token)
            this.$router.push('/user')
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
.login-content {
  margin-top: 200px;
  .logo {
    text-align: center;
  }
  .login-form {
    width: 500px;
    margin: 0 auto;
  }
  .login-code {
    display: flex;
    img {
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .email-code {
    width: 100px;
    box-sizing: border-box;
    margin-left: 10px;
  }
}
</style>