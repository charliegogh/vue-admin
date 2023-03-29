const { sys_dic_code, sys_dic_value } = require(process.cwd() + '/models')
const router = require('koa-router')()
const base = '/sys/dictCode'
const uuid = require('uuid')
const { flatToTree } = require(process.cwd() + '/utils/tree')
const moment = require('moment')
// 获取菜单列表
router.get(base + '/getList', async(ctx) => {
  try {
    const data = await sys_dic_code.findAll()
    ctx.success(
      data
    )
  } catch (e) {
    ctx.fail(e)
  }
})
// 删除
router.delete(base + '/delete', async(ctx) => {
  const { id } = ctx.request.query
  try {
    await sys_dic_code.destroy({
      where: {
        id
      }
    })
    ctx.success()
  } catch (e) {

  }
})
// 新增
router.post(base + '/add', async(ctx) => {
  const params = ctx.request.body
  try {
    await sys_dic_code.create(
      {
        id: uuid.v1(),
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        ...params
      })
    ctx.success()
  } catch (e) {
    ctx.fail(e)
  }
})
// 编辑
router.post(base + '/edit', async(ctx) => {
  const params = ctx.request.body
  try {
    await sys_dic_code.update(
      {
        ...params
      },
      {
        where: {
          id: params.id
        }
      }
    )
    ctx.success()
  } catch (e) {
    ctx.fail()
    console.log(e)
  }
})
module.exports = router.routes()

