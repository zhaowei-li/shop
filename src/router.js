import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to.path)
  const token = localStorage.getItem('shop')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
