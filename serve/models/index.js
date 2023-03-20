const Sequelize = require('sequelize')
const config = require('../config')
const fs = require('fs')
let db = {}
const path = require('path')
const basename = path.basename(__filename)
let sequelize = null
sequelize = new Sequelize(config.sequelize)
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })
// 读取文件
fs.readdirSync(__dirname)
  .filter((file) => {
    const result =
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    return result
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize)
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
db.sequelize = sequelize
db.Sequelize = Sequelize
// module.exports = db
module.exports = {
  ...db,
  sequelize
}
