import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'

Vue.use(Router)

const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    name: "登录"
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index')
      },
      {
        path: '/',
        component: () => import('@/views/home/index')
      },
      {
        path: '/menu',
        component: () => import('@/views/home/menu')
      }
    ]
  },

  {
    path: '/organizationManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/organizationManage/orgMaterial',
        component: () => import('@/views/organizationManage/orgMaterial')
      },
    ]
  },
  // {
  //   path: '/users',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/users',
  //       component: () => import('@/views/userManage/index')
  //     },
  //   ]
  // }
]
export { constantRouterMap }
export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// export default new Router({
//   routes: constantRouterMap
// })
//路由组件注册
export const asyncRouterMap = {
  '/views/layout/Layout': () => import('@/views/layout/Layout'),
  '/views/organizationManage/orgList': () => import('@/views/organizationManage/orgList'),
  '/views/organizationManage/orgTypeList': () => import('@/views/organizationManage/orgTypeList'),
  '/views/userManage/userList': () => import('@/views/userManage/userList'),
  '/views/userManage/roleList': () => import('@/views/userManage/roleList'),
}
