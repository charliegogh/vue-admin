const { sys_dic_code, sys_dic_value } = require(process.cwd() + '/models')
const router = require('koa-router')()
const base = '/sys/dictValue'
const uuid = require('uuid')
const moment = require('moment')
// 获取菜单列表
router.get(base + '/getList', async(ctx) => {
  try {
    const { id } = ctx.request.query
    const data = await sys_dic_value.findAll(
      {
        where: {
          did: id
        }
      }
    )
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
    await sys_dic_value.destroy({
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
    await sys_dic_value.create(
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
    await sys_dic_value.update(
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

