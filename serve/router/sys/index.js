const router = require('koa-router')()
const fs = require('fs')
// 批量读取
fs.readdirSync(__dirname).forEach(file => {
  !file.includes('index') && router.use(require('./' + file))
})
module.exports = router.routes()

