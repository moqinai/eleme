// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import './common/stylus/index.styl'

/* 设置为 false 以阻止 vue 在启动时生成生产提示 */
Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueResource)
/* eslint-disable no-new */
/* new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
}) */

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

/* 默认加载/goods */
// router.push('/goods')
