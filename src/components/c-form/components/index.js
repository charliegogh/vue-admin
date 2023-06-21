const modulesFiles = require.context(
  '.', false, /\.vue$/
)
const components = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  modules.push(value.default)
  return modules
}, [])
const registerComponents = {}
components.forEach(item => {
  registerComponents[item.name] = item
})

export {
  registerComponents
}
