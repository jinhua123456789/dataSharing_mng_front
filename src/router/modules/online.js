/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const onlineRouter = {
  path: '',
  component: Layout,
  meta: { title: '首页', icon: 'dashboard'},
  children: [
    {
      path: '',
      component: () => import('@/views/home/index'),
      hidden: true
    }
  ]
}
export default onlineRouter
