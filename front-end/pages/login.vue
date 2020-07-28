<template>
  <div class="m-login">
    loginaaa
    <el-form :rules="rules">
      <el-form-item props="email">
        <span class="el-icon-mobile"></span>
        <el-input type="text" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item props="password">
        <span class="el-icon-lock"></span>
        <el-input type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item props="validate">
        <div style="display: flex;">
          <el-input type="password" placeholder="验证码"></el-input>
          <img :src="captchaUrl" alt="" @click="updateCaptchaUrl()">
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  // layout: 'login',
  data() {
    return {
      rules: {},
      captchaUrl: ''
    }
  },
  mounted() {
    this.updateCaptchaUrl()
  },
  methods: {
    updateCaptchaUrl() {
      this.captchaUrl = '/api/captcha?_t=' + new Date().getTime()
    }
  }
}
</script>

<style lang="scss" scoped>
.m-login {
  margin: 200px;
}
</style>