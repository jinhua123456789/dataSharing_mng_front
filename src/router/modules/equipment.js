/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const equipmentRouter = {
  path: '/equipment',
  component: Layout,
  redirect: 'index',
  meta: { title: '设备管理', icon: 'tree', noCache: true, affix: true,
    roles: ['admin','device']
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/blank'),
      name: 'index',
      meta: { title: '设备管理', icon: 'tree', noCache: true, affix: true,
      }
    }
  ]
}
export default equipmentRouter
