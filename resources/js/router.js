import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'

Vue.use(Router)

import login from './components/pages/login'
import register from './components/pages/register'
import templates from './components/pages/templates'
import backgrounds from './components/pages/backgrounds'
import teams from './components/pages/teams'
import competitions from './components/pages/competitions'
import matches from './components/pages/matches'
import superadmin from './components/pages/superadmin'



const routes =[
    {
        path: '/',
        component: templates,
        meta: {
            requiresAuth: true
          }

    },
    {
        path: '/superadmin',
        component: superadmin,
        meta: {
            requiresSuperadmin: true
          }
    },
    {
        path: '/backgrounds',
        component: backgrounds,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/teams',
        component: teams,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/competitions',
        component: competitions,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/matches',
        component: matches,
        meta: {
            requiresAuth: true
          }
    },
    {
        path: '/login',
        component: login,
        meta: {
            loggedIn: true
          }
    },
    {
        path: '/register',
        component: register,
        meta: {
            loggedIn: true
          }
    },

]

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })

  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!store.getters['currentUser/admin']) {
        next({ path: '/login' })
      } else {
        next() // go to wherever I'm going
      }
    }
    if (to.matched.some(record => record.meta.requiresSuperadmin)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters['currentUser/superadmin']) {
          next({ path: '/login' })
        } else {
          next() // go to wherever I'm going
        }
    }
    if (to.matched.some(record => record.meta.loggedIn)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (store.getters['currentUser/user']) {
          next({ path: '/' })
        } else {
          next() // go to wherever I'm going
        }
    }
    else {
      next() // does not require auth, make sure to always call next()!
    }
  })


  export default router

