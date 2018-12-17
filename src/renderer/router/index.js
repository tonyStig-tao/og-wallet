import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: require('@/components/IndexPage').default
    },
    {
      path: '/account',
      name: 'account-page',
      component: require('@/components/account').default
    },
    {
      path: '/creatAccount',
      name: 'creatAccount-page',
      component: require('@/components/creatAccount').default
    },
    {
      path: '/importAccount',
      name: 'importAccount-page',
      component: require('@/components/importAccount').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})