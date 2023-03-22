import CTable from './index'
const plugins = {
  install(Vue) {
    Vue.component('CTable', CTable)
  }
}
export default plugins
