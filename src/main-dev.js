import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import Elementui from 'element-ui'
//用于按需倒入element文件  通过link标签，用cdn导入到public/index.html
import '@/elementui/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'

import axios from "axios"
import '@/assets/iconfont/iconfont.css'
// 全局注册树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器样式  通过link标签，用cdn导入到public/index.html
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 进度条
import NProgress from 'nprogress'
// 进度条样式表  通过link标签，用cdn导入到public/index.html
// import 'nprogress/nprogress.css'

// 全局注册组件
Vue.component('tree-table',TreeTable)
//配置请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求拦截器中展示进度条  NProgress.start();
axios.interceptors.request.use(config => {
  //拦截请求，给请求头加上 Authorization 的token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start();
  //最后必须返回config
  // console.log(config)
  return config;
})

// 响应拦截器中隐藏进度条  NProgress.done();
axios.interceptors.response.use(config=>{
  NProgress.done();
  return config;
})

Vue.prototype.$http = axios;
// Vue.use(Elementui)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')