import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'
Vue.use(VueRouter)
export const errorRoutes = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/404',
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
export const routes = [
  {
    path: '/user',
    component: Layout,
    name: 'User',
    hidden: true,
    children: [
      {
        path: '/user/account',
        name: 'userAccount',
        component: () => import('@/views/user/account'),
        meta: {
          title: '个人中心'
        }
      },
      {
        path: '/user/setting',
        name: 'userSetting',
        component: () => import('@/views/user/setting'),
        meta: {
          title: '账户设置'
        }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        name: 'redirect',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/user/login'),
    hidden: true
  },
  {
    path: '/test',
    hidden: true,
    component: () => import(/* webpackChunkName: "fail" */ '@/views/chat')
  }
]

const createRouter = () =>
  new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({
      y: 0
    }),
    routes: routes
  })

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

const router = createRouter()
export default router
