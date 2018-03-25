import VueRouter from 'vue-router'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

/* 定义路由 */
const routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
]

/* 创建router实例，然后传入‘routes’配置 */
const router = new VueRouter({
  mode: 'history', // 去除项目访问路径中的'#'号
  linkActiveClass: 'active', // 附加‘active’ class类（选中的
  routes
})

/* 导出 */
export default router
