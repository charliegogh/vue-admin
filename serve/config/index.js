module.exports = {
  development: require('./development'),
  production: require('./production')
}[process.env.node_env || 'development']
