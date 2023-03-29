const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
// 批量读取文件路由信息
fs.readdirSync(__dirname)
  .filter((file) => {
    const result =
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) !== '.js'
    return result
  })
  .forEach((file) => {
    router.use(require('./' + file))
  })
router.get('/test', async(ctx, next) => {
})
module.exports = router
