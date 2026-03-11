import { createWebHistory, createRouter } from 'vue-router'
import LoginComponent from "../components/LoginComponent.vue";
import ParentComponent from "../components/ParentComponent.vue";
import WelcomeComponent from '../components/WelcomeComponent.vue';
import ChildComponent from '../components/ChildComponent.vue';

// 1. 定义路由规则：路径 ↔ 组件
const routes = [
  { 
    path: '/', 
    component: LoginComponent ,
    meta: { requiresAuth: false} // 登录页不需要认证
  }, 
  { 
    path: '/login', 
    component: LoginComponent ,
    meta: { requiresAuth: false} // 登录页不需要认证
  }, 
  { 
    path: '/welcome', 
    component: WelcomeComponent ,
    meta: { requiresAuth: true}, // 登录页需要认证
    // 嵌套路由
    children: [ 
      {
      path: '/welcome/parent', 
      component: ParentComponent ,
      children: [
        { 
          path: '/welcome/child', 
          component: ChildComponent ,
          meta: { requiresAuth: true}
        },
       ]
    },
    { 
      path: '/child', 
      component: ChildComponent ,
      meta: { requiresAuth: true}
    },
    ]

  },
]

// 2. 创建路由实例
const DuJiaCun_Router = createRouter({
  history: createWebHistory(),// 使用 HTML5 History 模式（无 #）
  routes,
})

//路由守卫
// DuJiaCun_Router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   const requiresAuth = to.meta.requiresAuth

//   if (requiresAuth && !token) {
//     // 需要登录但未登录 → 跳转到登录页
//     next('/')
//   } else if (to.path === '/' && token) {
//     // 已登录用户访问登录页 → 跳转到主页
//     next('/welcome')
//   } else {
//     // 其他情况正常放行
//     next()
//   }
// })

// 3. 导出，供 main.js 使用
export default DuJiaCun_Router