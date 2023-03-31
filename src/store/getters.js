export default {
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  routes: state => state.user.routes,
  token: state => state.user.token,
  dict: state => state.app.dict,
  color: state => state.app.color,
  layoutMode: state => state.app.layoutMode
  // regionList: state => state.app.regionList,
}
