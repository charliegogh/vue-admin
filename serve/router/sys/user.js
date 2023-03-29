const { sys_users } = require(process.cwd() + '/models')
const router = require('koa-router')()
const base = '/sys/user'
const uuid = require('uuid')
router.get(base + '/list', async(ctx) => {
  try {
    const data = await sys_users.findAll(
    )
    ctx.success(data)
  } catch (e) {
    console.log(e)
  }
})
// 删除
router.delete(base + '/delete', async(ctx) => {
  const { id } = ctx.request.query
  try {
    await sys_users.destroy({
      where: {
        id
      }
    })
    ctx.success()
  } catch (e) {
    ctx.fail('删除失败')
  }
})
// 新增
router.post(base + '/add', async(ctx) => {
  const params = ctx.request.body
  try {
    await sys_users.create(
      {
        id: uuid.v1(),
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
    await sys_users.update(
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
