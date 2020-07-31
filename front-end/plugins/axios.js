import Vue from 'vue'
import axios from 'axios'
import { MessageBox } from 'element-ui'


const service = axios.create({
  baseURL: '/api'
})

export default ({store, redirect}) => {
  service.interceptors.request.use(async config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    return config
  })
  
  // 响应拦截
  service.interceptors.response.use(async response => {
    let { data } = response
  
    if (data.code === -666) {
      MessageBox.confirm('登陆已过期', '过期', {
        type: 'warning',
        confirmButtonText: '去登陆',
        showCancelButton: false
      }).then(() => {
        localStorage.removeItem('token')
        // 重定向到登陆页面
        redirect({path: 'login'})
      })
    }
  
    return data
  })
}

Vue.prototype.$http = service

export const http = service