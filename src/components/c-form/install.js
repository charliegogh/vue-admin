import Vue from 'vue'
const modulesFiles = require.context(
  '.', false, /\.vue$/
)
const components = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  modules.push(value.default)
  return modules
}, [])

components.forEach(item => {
  Vue.component(item.name, item.default || item)
})

export default components
