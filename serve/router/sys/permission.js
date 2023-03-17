const { sys_menus, sys_roles } = require(process.cwd() + '/models')
const router = require('koa-router')()
const base = '/sys/permission'
const uuid = require('uuid')
const { flatToTree } = require(process.cwd() + '/utils/tree')
// 获取菜单列表
router.get(base + '/getSystemMenuList', async(ctx) => {
  try {
    const data = await sys_menus.findAll()
    ctx.success(
      flatToTree(
        data,
        '',
        'pid')
    )
  } catch (e) {
    console.log(e)
  }
})
// 删除
router.delete(base + '/delete', async(ctx) => {
  const { id } = ctx.request.query
  try {
    await sys_menus.destroy({
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
    await sys_menus.create(
      {
        id: uuid.v1().replaceAll('-', ''),
        ...params
      })
    ctx.success()
  } catch (e) {
    console.log(e)
    ctx.fail(e)
  }
})
// 编辑
router.post(base + '/edit', async(ctx) => {
  const params = ctx.request.body
  try {
    await sys_menus.update(
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
// 获取角色权限信息
router.get(base + '/queryRolePermission', async(ctx) => {
  try {
    const { roleId } = ctx.request.query
    const data = await sys_roles.findOne(
      {
        where: {
          id: roleId
        }
      }
    )

    ctx.success(data.permissionIds.split(','))
  } catch (e) {
    console.log(e)
  }
})
// 保存角色权限信息
router.post(base + '/saveRolePermission', async(ctx) => {
  try {
    const params = ctx.request.body
    await sys_roles.update(
      {
        ...params
      },
      {
        where: {
          id: params.roleId
        }
      }
    )
    ctx.success()
  } catch (e) {
    console.log(e)
  }
})

module.exports = router.routes()

