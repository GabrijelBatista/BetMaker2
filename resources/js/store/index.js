import Vue from "vue"
import Vuex from "vuex"
import currentUser from "./currentUser"
import errors from "./errors"
import superadmin from "./superadmin"
import templates from "./templates"
import backgrounds from "./backgrounds"
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)



export default new Vuex.Store({

    modules: {
        currentUser,
        errors,
        templates,
        superadmin,
        backgrounds
    },
    plugins: [
        createPersistedState({
          paths: ['currentUser', 'templates', 'superadmin', 'backgrounds'],
        }),
      ],
})
