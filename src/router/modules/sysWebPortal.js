/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const sysWebPortalRouter = {
  path: '/sysWebPortal',
  component: Layout,
  redirect: '/sysWebPortal/blockManagement',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '门户内容管理',
    icon: 'form',
  },
  children: [
    {
      path: 'blockManagement',
      component: () => import('@/views/portal/block/blockManagement'),
      hidden: false,
      name: 'BlockManagement',
      meta: {
        title: '版块管理',
      }
    },
    {
      path: 'contentManagement',
      component: () => import('@/views/portal/content/contentManagement'),
      hidden: false,
      name: 'ContentManagement',
      meta: {
        title: '内容管理',
      }
    },
    {
      path: 'contentAudit',
      component: () => import('@/views/portal/audit/auditManagement'),
      hidden: false,
      name: 'ContentAudit',
      meta: {
        title: '内容审核管理',
      }
    }
  ]
}
export default sysWebPortalRouter
