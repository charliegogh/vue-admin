import Cookies from 'js-cookie'
import { jsonp } from 'vue-jsonp'
import * as fetch from '@/api'
import { Local } from '_utils/storage'
import config from '@/defaultSettings'
const state = {
  title: '',
  sidebar: {
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : true,
    withoutAnimation: false
  },
  device: 'desktop',
  dict: {},
  color: Local.readData('DEFAULT_COLOR') || config.primaryColor,
  layoutMode: Local.readData('DEFAULT_LAYOUT_MODE') || config.layoutMode,
  theme: Local.readData('DEFAULT_THEME') || config.navTheme,
  staticFile: {}, // 静态文件
  regionList: [] // 地区信息
}
const mutations = {
  // 侧边
  TOGGLE_SIDEBAR: (state, opened) => {
    state.sidebar.opened = !state.sidebar.opened
    if (opened) state.sidebar.opened = opened
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  // 窗口切换
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  // 主题色切换
  TOGGLE_COLOR: (state, color) => {
    Local.saveData('DEFAULT_COLOR', color)
    state.color = color
  },
  TOGGLE_THEME: (state, theme) => {
    Local.saveData('DEFAULT_THEME', theme)
    state.theme = theme
  },
  // 导航模式切换
  TOGGLE_LAYOUT_MODE: (state, layout) => {
    Local.saveData('DEFAULT_LAYOUT_MODE', layout)
    state.layoutMode = layout
  },
  SET_DICT: (state, data) => {
    state.dict = {
      ...state.dict,
      ...data
    }
  },
  // 地址列表
  SET_REGION_LIST: (state, data) => {
    state.regionList = data
  },
  // 静态json文件
  SET_STATIC_FILE: (state, data) => {
    state.staticFile = {
      ...state.staticFile,
      ...data
    }
  }
}
const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  ToggleColor({ commit }, color) {
    commit('TOGGLE_COLOR', color)
  },
  ToggleLayoutMode({ commit }, mode) {
    commit('TOGGLE_LAYOUT_MODE', mode)
  },
  ToggleTheme({ commit }, theme) {
    commit('TOGGLE_THEME', theme)
  },
  /**
   * 获取字典配合缓存
   *
   */
  loadDict({ state, commit }, dictArr) {
    return new Promise(resolve => {
      const codeList = dictArr.filter(item => !state.dict[item.code || item])
      Promise.all(
        codeList.map(i => {
          return fetch.getAction(i.api || '/test', {
            code: i.code || i
          })
        })
      ).then(res => {
        commit(
          'SET_DICT',
          Object.fromEntries(
            codeList.map((code, index) => [
              [code.code || code],
              res[index].data
            ])
          )
        )
        resolve()
      })
    })
  },
  /**
   * 配置全局dict  后期可优化，现有只会替换
   */
  setDict({ state, commit }, dictArr) {
    commit('SET_DICT', dictArr)
  },
  /**
   * 通用地址列表
   */
  async getRegionList({ commit }) {
    const regionList = Local.readData('regionList')
    if (regionList && regionList.length === 0) {
      const data = await jsonp('./json/area.json', {
        callbackName: 'area'
      })
      Local.saveData('regionList', data)
      commit('SET_REGION_LIST', data)
    } else {
      commit('SET_REGION_LIST', regionList)
    }
    return Promise.resolve(regionList)
  },
  /**
   * 动态静态文件   后续配合本地缓存使用
   */
  getStaticFile({ state, commit }, obj) {
    return new Promise(resolve => {
      const list = Object.entries(obj).filter(
        item => !state.staticFile[item[0]]
      )
      Promise.all(
        list.map(item => jsonp(item[1], { callbackName: item[0] }))
      ).then(res => {
        const data = Object.fromEntries(
          list.map((J, index) => [[J[0]], res[index]])
        )
        commit('SET_STATIC_FILE', data)
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
