import { getToken, setToken, removeToken } from '@/utils/auth'
import { postAction } from '@/api'
import { errorRoutes } from '@/router'
import Layout from '@/layout/index'
const state = {
  token: getToken(), // 当前用户token
  userInfo: {},
  routes: [], // 左侧需要展示的路由列表
  roles: [] // 权限信息
}
const mutations = {
  // 设置token
  SET_TOKEN: (state, data) => {
    state.token = data
  },
  // 设置用户信息
  SET_USER_INFO: (state, data) => {
    state.userInfo = data
  },
  // 获取用户权限数组
  SET_ROUTERS: (state, routes) => {
    state.routes = routes
  },
  // 设置用户权限
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}
const actions = {
  // 登录
  async login({ commit, dispatch }, form) {
    const obj = Object.keys(form)
    if (obj.length !== 0) {
      const res = await postAction('/loginPc', form)
      try {
        if (res.code === 200) {
          const { msg } = res
          commit('SET_TOKEN', msg)
          setToken(msg)
        }
        return await Promise.resolve(res)
      } catch (e) {
        dispatch('logOut')
        throw e
      }
    }
  },
  // 获取用户信息
  async getInfo({ commit, state, dispatch }) {
    const res = await postAction('/getUserInfo')
    try {
      if (res.code === 200) {
        const { data } = res
        commit('SET_USER_INFO', data.sysUser)
        // 获取按钮数组信息
        await dispatch('getRoles', data.menuInfo)
        // 处理权限路由结构信息
        res.needRoutes = await dispatch('generateRoutes', data.menuInfo)
      } else {
        dispatch('logOut')
      }
    } catch (e) {
      console.log(e)
    }
    return Promise.resolve(res)
  },
  // 生成路由表
  async generateRoutes({ commit, dispatch }, routes) {
    const asyncRoutes = formatRoutes(routes)
    const redirect = asyncRoutes[0].redirect || '/dashboard/analysis'
    const _routes = [{
      path: '/',
      component: Layout,
      redirect: redirect,
      meta: {
        title: ''
      },
      children: asyncRoutes
    }].concat(errorRoutes) // 组合完毕之后再去添加静态路由用来防止异步
    commit('SET_ROUTERS', asyncRoutes) // 侧边栏结构
    return _routes
  },
  // 权限按钮信息
  async getRoles({ commit, dispatch }, menuList) {
    const roles = []
    const getRolesList = menuList => {
      menuList.forEach(item => {
        if (item.type === 2) roles.push(item.code)
        item.children && getRolesList(item.children)
      })
      return roles
    }
    getRolesList(menuList)
    commit('SET_ROLES', roles)
  },
  /* 更新用戶信息 （用户相关信息更改之后） */
  async updateUserInfo({ commit }) {
    try {
      const res = await postAction('/getUserInfo')
      if (res.success) {
        commit('SET_USER_INFO', res)
      }
    } catch (e) {
      console.log(e)
    }
  },
  // 同步登出
  async logOut() {
    await removeToken()
    location.reload()
  }
}

// 递归生成路由结构信息

/**
 * @param menuList
 * icon属性 不能为空 前端在此数据替
 * name属性 必须项且唯一，否则侧边栏无法点击
 */
const formatRoutes = (menuList = []) => {
  return menuList.map(item => {
    if (item.children && item.children.length && item.children[0].type !== 2) {
      return {
        path: item.pageUrl,
        children: formatRoutes(item.children),
        name: item.name,
        redirect: item.children[0].pageUrl,
        // hidden: item.hidden,
        component(resolve) {
          require(['@/layout/publish-center'], resolve)
        },
        meta: { title: item.name, icon: item.icon || 'medicine-box' }
      }
    } else {
      const component = `views${item.pageUrl}`
      return {
        path: item.pageUrl,
        name: item.name,
        // hidden: item.hidden,
        component(resolve) {
          require(['@/' + component + '.vue'], resolve)
        },
        meta: {
          title: item.name,
          icon: item.icon,
          target: item.internalOrExternal === '0' ? '_blank' : ''
        }
      }
    }
  })
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
