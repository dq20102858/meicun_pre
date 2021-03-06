const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  system: state => state.user.system,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters