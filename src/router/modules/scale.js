/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const scaleRouter = {
  path: '/scale',
  component: Layout,
  redirect: '/scale/complex-table',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '量表管理',
    icon: 'form',
    roles: ['admin','expert']
  },
  children: [
    {
      path: '/scaleManagement',
      component: () => import('@/views/scale/complexTable'),
      hidden: false,
      name: 'ScaleManagement',
      meta: {
        title: '量表列表',
      }
    }
  ]
}
export default scaleRouter
