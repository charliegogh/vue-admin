const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const secret = 'charlie' // 加密key
const { sys_users, sys_roles, sys_menus, sys_users_role, sys_role_menus } = require(process.cwd() + '/models')
const { flatToTree } = require(process.cwd() + '/utils/tree')
/**
 * 登录
 */
router.post('/loginPC', async(ctx) => {
  try {
    const { username } = ctx.request.body
    const data = await sys_users.findOne({
      where: {
        username: username
      }
    })
    ctx.body = {
      code: 200,
      msg: jwt.sign({ id: data.id }, secret, {
        expiresIn: 6000 // 20min  过期
      })
    }
  } catch (e) {
    ctx.fail(e)
    console.log(e)
  }
})
/**
 *  获取用户信息
 */
router.post('/getUserInfo', async(ctx) => {
  const { authorization } = ctx.request.header
  const id = jwt.verify(authorization, secret, (err, decode) => {
    if (!err) {
      return decode.id
    } else {
      return undefined
    }
  })
  if (!id) {
    ctx.fail('登录失效', 401)
    return
  }
  // 用户id
  const { dataValues: userInfo } = id && await sys_users.findOne({
    where: {
      id: id
    }
  })
  // 角色id
  const { dataValues: { role_id }} = id && await sys_users_role.findOne({
    where: {
      user_id: userInfo.id
    }
  })
  // 菜单权限
  const roleMenu = await sys_role_menus.findAll(
    {
      where: {
        role_id: role_id
      }
    }
  )
  // 查询
  const menu = await sys_menus.findAll(
    {
      where: {
        id: roleMenu.map(i => i.dataValues.menu_id)
      },
      order: [
        ['orderNo', 'ASC']
      ]
    }
  )
  const data = {
    sysUser: userInfo,
    buttonCodes: [],
    menuInfo: flatToTree(
      menu,
      '',
      'pid')
  }
  id && ctx.success(data)
})
module.exports = router.routes()
