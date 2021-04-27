/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const statisticRouter = {
  path: '/statistic',
  component: Layout,
  name: 'statistic',
  meta: {title: '统计管理', icon: 'chart'},
  children: [
    {
      path: '/horizontal',
      component: () => import('@/views/blank'),
      name: 'horizontal',
      meta: { title: '横向统计' }
    },
    {
      path: '/portrait',
      component: () => import('@/views/blank'),
      name: 'portrait',
      meta: { title: '纵向统计' }
    }
  ]
}

export default statisticRouter
