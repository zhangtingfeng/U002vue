import Vue from 'vue'

import api from './http'
import i18n from './i18n'
import store from './store'
import global from '@/utils/global'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css' 
import echarts from 'echarts'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import utils from '@/assets/js/utils' 
import {  Message } from 'element-ui'
import App from './App'
import mathUtils from '@/utils/mathUtils'
 
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Videojs from 'video.js'
 
import 'video.js/dist/video-js.css'
 
Vue.prototype.$video = Videojs 
Vue.use(VueQuillEditor) 
Vue.prototype.$message = Message 
Vue.prototype.$echarts = echarts 
Vue.use(ElementUI)
Vue.use(api)

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.utils = utils

Vue.prototype.global = global
Vue.prototype.mathUtils = mathUtils
// 请求拦截（配置发送请求的信息）
axios.interceptors.request.use(function (config){
  // 处理请求之前的配置 
  return config;
  }, function (error){ 
  // 请求失败的处理
  return Promise.reject(error);
  });
  
// response 拦截器
axios.interceptors.response.use(
  response => {  
    return response
  },
  err => { 
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break
        case 401:
          err.message = '未授权，请登录'
          break
        case 403:
          err.message = '拒绝访问'
          break
        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`
          break
        case 408:
          err.message = '请求超时'
          break
        case 500:
          err.message = '服务器内部错误'
          break
        case 501:
          err.message = '服务未实现'
          break
        case 502:
          err.message = '网关错误'
          break
        case 503:
          err.message = '服务不可用'
          break
        case 504:
          err.message = '网关超时'
          break
        case 505:
          err.message = 'HTTP版本不受支持'
          break
        default:
      }
    } 
    return Promise.reject(err) // 返回接口返回的错误信息
  }
)

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
});