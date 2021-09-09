import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import onlineRouter from './modules/online'
// import gridEditRouter from "@/router/modules/gridEdit";


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  /*{
    path: '/project',
    name: 'project',
    meta: {
      title: '项目立项管理',
      icon: 'edit'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    component: Layout,
    children: [
      {
        path: 'projects',
        component: () => import('@/views/project/jbxx'),
        name: 'Projects',
        meta: { title: '项目基本信息管理',
          icon: 'tree',
          noCache: true }
      },
      {
        path: 'projectMaterialsSubmit',
        name: 'ProjectMaterialsSubmit',
        component: () => import('@/views/project/projectMaterialsSubmit'),
        meta: { title: '勘察单位立项资料管理',
          icon: 'tree',
          noCache: true }
      },
      {
        path: 'jijinProjectMaterialsSubmit',
        name: 'JijinProjectMaterialsSubmit',
        component: () => import('@/views/project/jijinProjectMaterialsSubmit'),
        meta: { title: '项目审核管理',
          icon: 'tree',
          noCache: true }
      },
      {
        path: 'assignmentBookManage',
        name: 'AssignmentBookManage',
        component: () => import('@/views/project/assignmentBookManage'),
        meta: {
          title: '项目任务书管理',
          icon: 'tree',
          noCache: true
        }
      },
      {
        path: 'kanchaAssignmentBookManage',
        name: 'KanchaAssignmentBookManage',
        component: () => import('@/views/project/kanchaAssignmentBookManage'),
        meta: {
          title: '勘察单位项目任务书管理',
          icon: 'tree',
          noCache: true
        }
      }
      // ,
      // {
      //   path: 'jijinAssignmentBookManage',
      //   name: 'JijinAssignmentBookManage',
      //   component: () => import('@/views/project/jijinAssignmentBookManage'),
      //   meta: {
      //     title: '基金项目任务书管理',
      //     icon: 'tree',
      //     noCache: true
      //   }
      // }
      // ,
      // {
      //   path: 'supervisionPlanManage',
      //   name: 'SupervisionPlanManage',
      //   component: () => import('@/views/project/supervisionPlanManage'),
      //   meta: {
      //     title: '项目监理计划管理',
      //     icon: 'tree'
      //   }
      // },
      // {
      //   path: 'supervisionBookManage',
      //   name: 'SupervisionBookManage',
      //   component: () => import('@/views/project/supervisionBookManage'),
      //   meta: {
      //     title: '项目监理任务书管理',
      //     icon: 'tree'
      //   }
      //
      // }
    ]
  },*/
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authRedirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/contentSysAdd',
    component: () => import('@/views/portal/content/contentAdd'),
    hidden: true,
    name: 'ContentAdd',
    meta: {
      title: '内容新增'
    },
  },
  {
    path: '/contentSysWholeInfo',
    component: () => import('@/views/portal/content/contentWholeInfo'),
    hidden: true,
    name: 'ContentWholeInfo',
    meta: {
      title: '内容详情'
    },
  },
  {
    path: '/contentSysModify',
    component: () => import('@/views/portal/content/contentModify'),
    hidden: true,
    name: 'ContentModify',
    meta: {
      title: '内容修改'
    },
  },
  {
    path: '/auditSysWholeInfo',
    component: () => import('@/views/portal/audit/auditWholeInfo'),
    hidden: true,
    name: 'AuditWholeInfo',
    meta: {
      title: '内容详情'
    },
  },
  {
    path: '/dataPreview',
      component: () => import('@/views/dataShare/dataPreview'),
    hidden: true,
    name: 'dataPreview',
    meta: {
      title: '数据预览'
    },
  },
  {
    path: '/erDiagram',
    component: () => import('@/views/dataShare/erDiagram'),
    hidden: true,
    name: 'erDiagram',
  },

  onlineRouter/*,
  checkAndAcceptRouter*/
  // ,gridEditRouter
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
