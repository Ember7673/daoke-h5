import Vue from 'vue'
import App from './App.vue'
import Routes from '@/router';
import VueRouter from 'vue-router';
import '@/assets/css/index.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Distpicker from 'v-distpicker'
import NProgress from 'nprogress'
import { getCookie } from '@/utils'
import axios from 'axios';

NProgress.configure({ showSpinner: false })

Vue.config.productionTip = false
const router = new VueRouter({
  routes: Routes,
  mode: "hash"
})

//路由守卫
router.beforeEach(async (to, from, next) => {
  // 开始页面加载进度条
  NProgress.start()
  // 通过cookie判断用户是否登录
  const userInfo = getCookie('userInfo')
  if (!userInfo) {
    // 判断是否去login页面,不然会陷入死循环
    if (to.path !== "/login" && to.path !== '/register') {
      next({ path: '/login' })
    } else if (to.path === "/register") {
      next()
    } else {
      next()
    }
  } else {
    // 在已经登录的情况下，如果访问登录页面则直接跳转到系统首页
    if (to.path === '/login') {
      next({ path: '/home', replace: true })
      NProgress.done()
    }
    next()
  }
})

//路由守卫
router.afterEach(() => {
  NProgress.done()
})

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.component('v-distpicker', Distpicker)
Vue.prototype.$axios = axios

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
