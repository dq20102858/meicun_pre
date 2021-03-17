import router from './router/index'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/demo'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  //debugger
  // var dd=getToken();
  if (getToken()) {
    // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetUserInfo')
          .then(res => {
            // 拉取user_info
            //const access = res.data.access;
            localStorage.setItem("ROLEMENU", JSON.stringify(res.data.access)); 
            const access = [
              {
                "id": 1,
                "roleId": 1,
                "systemId": 1,
                "moduleActionName": "/views/layout/Layout",
                "moduleTitle": "机构管理",
                "modulePathName": "organizationManage",
                "modulePath": "organizationManage",
                "moduleHide": 0,
                "moduleIcon": "",
                "noCache": false,
                "children": [
                  {
                    "id": 11,
                    "roleId": 1,
                    "systemId": 1,
                    "moduleActionName": "/views/organizationManage/orgList",
                    "moduleTitle": "机构管理",
                    "modulePathName": "orgList",
                    "modulePath": "/organizationManage/orgList",
                    "moduleHide": 0,
                    "moduleIcon": "",
                    "noCache": false
                  },
                  {
                    "id": 12,
                    "roleId": 1,
                    "systemId": 1,
                    "moduleActionName": "/views/organizationManage/orgTypeList",
                    "moduleTitle": "机构类型",
                    "modulePathName": "orgTypeList",
                    "modulePath": "/organizationManage/orgTypeList",
                    "moduleHide": 0,
                    "moduleIcon": "",
                    "noCache": false
                  }
                ]
              },
              {
                "id": 2,
                "roleId": 1,
                "systemId": 1,
                "moduleActionName": "/views/layout/Layout",
                "moduleTitle": "账号管理",
                "modulePath": "userManage",
                "modulePathName": "userManage",
                "moduleHide": 0,
                "moduleIcon": "",
                "noCache": false,
                "children": [
                  {
                    "id": 21,
                    "roleId": 1,
                    "systemId": 1,
                    "moduleActionName": "/views/userManage/index",
                    "moduleTitle": "账号设置",
                    "modulePathName": "index",
                    "modulePath": "/userManage/index",
                    "moduleHide": 0,
                    "moduleIcon": "",
                    "noCache": false
                  },
                  {
                    "id": 22,
                    "roleId": 1,
                    "systemId": 1,
                    "moduleActionName": "/views/userManage/roleList",
                    "moduleTitle": "角色管理",
                    "modulePathName": "roleList",
                    "modulePath": "/userManage/roleList",
                    "moduleHide": 0,
                    "moduleIcon": "",
                    "noCache": false
                  }
                ]
              }
            ]
            const roles = res.data.roles;
            store.dispatch('GenerateRoutes', { access, roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              //console.log("router："+JSON.stringify(router.addRoutes()))
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
            // const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
            // store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            //   router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            //   next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            // })
          })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next() //
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true } })
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})