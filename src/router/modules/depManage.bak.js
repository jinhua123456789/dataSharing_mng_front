/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const onlineRouter = {
  path: '',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/depManage/index'),
      name: '',
      meta: { title: '部门管理', icon: 'dashboard'}
    }
  ]
}
export default onlineRouter
