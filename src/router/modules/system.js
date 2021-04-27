import Layout from '@/layout'

const systemRouter = {
  path: '/pcs-system',
  component: Layout,
  redirect: '/pcs-institution/institution',
  //alwaysShow: true, // will always show the root menu
  meta: {
    title: '平台管理',
    icon: 'list',
    roles: ['admin']
  },
  children: [
    {
      path: 'institution',
      component: () => import('@/views/pcs-institution/institution'),
      name: 'Institution',
      meta: {
        title: '机构管理',
      }
    },
    {
      path: 'lzx',
      component: () => import('@/views/depManage/index'),
      name: 'DepMangelll',
      meta: { title: '部门管理', icon: 'dashboard'}
    },
    {
      path: 'sysuser',
      component: () => import('@/views/pcs-sysuser/sysuser'),
      name: 'Institution',
      meta: {
        title: '用户管理',
      }
    },{
      path: 'role',
      component: () => import('@/views/pcs-role/role'),
      name: 'Role',
      meta: {
        title: '角色管理',
      }
    },{
      path: 'privilege',
      component: () => import('@/views/pcs-privilege/privilege'),
      name: 'privilege',
      meta: {
        title: '权限管理',
      }
    }
    ,{
      path: 'org-privilege',
      component: () => import('@/views/pcs-orgPrivilege/orgPrivilege'),
      name: 'orgPrivilege',
      meta: {
        title: '机构权限管理',
      }
    }
    ,{
      path: 'dirt',
      component: () => import('@/views/blank'),
      name: 'privilege',
      meta: {
        title: '字典管理',
      }
    }
    ,{
      path: 'log',
      component: () => import('@/views/log/log'),
      name: 'privilege',
      meta: {
        title: '日志管理',
      }
    }
  ]
}

export default systemRouter
