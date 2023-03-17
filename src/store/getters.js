export default {
  // 用户数据
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  routes: state => state.user.routes, // 路由
  token: state => state.user.token,
  dict: state => state.app.dict,
  regionList: state => state.app.regionList
}
