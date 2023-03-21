import router, { resetRouter } from '@/router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/register', '/login', '/forget', '/test']
import { getToken } from '@/utils/auth'
NProgress.configure({ showSpinner: false })
router.beforeEach(async(to, from, next) => {
  NProgress.start() // start progress bar
  try {
    const hasToken = getToken()
    if (hasToken) {
      // 如果当前状态为登陆状态，手动输入login直接跳转去首页
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasUserInfo = store.getters.userInfo && Object.keys(store.getters.userInfo).length > 0
        try {
          // 获取用户信息->根据用户信息获取对应权限->渲染路由并进入平台
          if (hasUserInfo) {
            next()
          } else {
            const { needRoutes } = await store.dispatch('user/getInfo')
            next()
            resetRouter() // 重置路由结构(避免动态添加重复路由问题)
            router.addRoutes(needRoutes) // 动态添加路由
            next({ ...to, replace: true })
          }
        } catch (e) {
          // await store.dispatch('user/logOut')
          NProgress.done()
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } catch (e) {
  }
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
