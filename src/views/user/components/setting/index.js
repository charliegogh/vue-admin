const modulesFiles = require.context(
  '.', false, /\.vue$/
)
const components = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  modules.push(value.default)
  return modules
}, [])
const register_components = {}
components.forEach(item => {
  register_components[item.name] = item
})

export {
  register_components
}
