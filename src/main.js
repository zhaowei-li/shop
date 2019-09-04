import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor /* { default global options } */)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.filter('dateFilter', value => {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器, 每次只要请求了, 都会被拦截到
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 每次真正请求出去之前, 都带上 token, 拼到请求头中
    config.headers.Authorization = localStorage.getItem('shop')
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    response = response.data
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
