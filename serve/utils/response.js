// 公共信息返回
const responseBody = (option = {}) => {
  return async(ctx, next) => {
    ctx.success = function(data, msg) {
      ctx.body = {
        code: option.code || 200,
        message: msg,
        success: true,
        data
      }
    }
    ctx.fail = function(msg, code) {
      ctx.response.status = code || 500
      ctx.body = {
        code: code || option.code || 500,
        message: msg || option.msg || 'fail'
      }
    }
    await next()
  }
}
module.exports = responseBody
