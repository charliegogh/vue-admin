const Koa = require('koa')
const router = require('./router')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const logger = require('koa-logger')()
const config = require('./config') // 全局配置
const routerResponse = require('./utils/response')

// 路由
new Koa()
  // 跨域配置
  .use(cors({
    /* 默认情况下，cookie不包括在请求中，如果前台携带cookie，此处需要开启，否则跨域失效*/
    credentials: true
  }))
  // bodyParser:post 请求体解析
  .use(bodyParser({
    multipart: true, // 支持文件上传
    enableTypes: ['json', 'form', 'text']
  }))
  .use(logger)
  // 公共返回
  .use(routerResponse())
  // router
  .use(router.routes())
  .use(router.allowedMethods())
  // port
  .listen(config.port, on)
/**
 * start serve
 */
function on() {
    const port = config.port
  console.log(`server port ${port} listening and open browser with http://localhost:${port}....`)
}
