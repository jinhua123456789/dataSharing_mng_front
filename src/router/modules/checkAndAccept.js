/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const checkAndAcceptRouter = {
  path: '',
  component: Layout,
  children: [
    {
      path: 'checkAndAccept',
      component: () => import('@/views/checkAndAccept/checkAndAccept'),
      name: '项目验收管理',
      meta: { title: '项目验收管理', icon: 'dashboard'}
    },
    {
      path: 'fmCheckAndAccept',
      component: () => import('@/views/checkAndAccept/fmCheckAndAccept'),
      name: '基金项目验收管理',
      meta: { title: '基金项目验收管理', icon: 'dashboard'}
    }
  ]
}
export default checkAndAcceptRouter
