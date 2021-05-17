import Vue from "vue"
import Vuex from "vuex"
import currentUser from "./currentUser"
import errors from "./errors"
import superadmin from "./superadmin"
import templates from "./templates"
import backgrounds from "./backgrounds"
import competitions from "./competitions"
import teams from "./teams"
import matches from "./matches"
import templateOptions from "./templateOptions"

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)



export default new Vuex.Store({

    modules: {
        currentUser,
        errors,
        templates,
        superadmin,
        backgrounds,
        competitions,
        teams,
        matches,
        templateOptions
    },
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
            paths: ['templateOptions', 'currentUser', 'templates', 'superadmin', 'backgrounds', 'competitions', 'teams', 'matches'],
        }),
      ],
})
