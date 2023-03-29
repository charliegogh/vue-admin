const router = require('koa-router')()
const upload = require(process.cwd() + '/utils/upload.js')
// 文件上传
router.post('/upload', upload.single('file'), async(ctx) => {
  console.log('~~~~~')
  ctx.body = {
    path: ctx.req.file.filename
  }
})
module.exports = router.routes()
