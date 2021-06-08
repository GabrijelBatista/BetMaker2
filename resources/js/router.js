import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'

Vue.use(Router)

//authentication
import login from './components/pages/login.vue'
import register from './components/pages/register.vue'
import verification from "./components/pages/verification";

//basic
import templates from './components/pages/templates.vue'
import backgrounds from './components/pages/backgrounds.vue'
import teams from './components/pages/teams.vue'
import competitions from './components/pages/competitions.vue'
import matches from './components/pages/matches.vue'

//superadmin
import superadmin from './components/pages/superadmin.vue'

//BetLive
import votestory from './components/BetLive/votestory.vue'




const routes =[

    //basic
    {
        path: '/',
        component: templates,
        meta: {
            requiresAuth: true
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

    //superadmin
    {
        path: '/superadmin',
        component: superadmin,
        meta: {
            requiresSuperadmin: true
          }
    },

    //authentication
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
    {
        path: '/verification',
        component: verification,
        meta: {
            loggedIn: true
        }
    },

    //BetLive
    {
        path: '/Vote_Story',
        component: votestory,
        meta: {
            BetLive: true
          }
    },
]

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })

  //basic
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!store.getters['currentUser/user']) {
        next({ path: '/login' })
      }
      else {
        next()
      }
    }

    //superadmin
    if (to.matched.some(record => record.meta.requiresSuperadmin)) {
        if (!store.getters['currentUser/superadmin']) {
          next({ path: '/login' })
        }
        else {
          next()
        }
    }

    //authentication
    else if (to.matched.some(record => record.meta.loggedIn)) {
        if (store.getters['currentUser/user']) {
          next({ path: '/' })
        }
        else {
          next()
        }
    }

    //BetLive
    else if (to.matched.some(record => record.meta.BetLive)) {
        if (store.getters['currentUser/user']) {
            if (store.getters['currentUser/user'].role_id != 1 && store.getters['currentUser/user'].id != 1) {
                next({path: '/login'})
            } else {
                next()
            }
        }
         else {
            next({path: '/login'})
        }
    }

    else {
        next()
      }

  })


  export default router

