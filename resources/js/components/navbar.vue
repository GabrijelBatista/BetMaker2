<template>
<nav>
    <v-app-bar app id="navbar" dense dark>
        <v-snackbar v-model="error" transition="fade-transition" :timeout="3000" color="red">
            <div v-for="err in error" :key="err[0]"><span>{{err[0]}}</span></div>
        </v-snackbar>
        <v-snackbar v-model="success" transition="fade-transition" :timeout="2000" color="green">
            <span>{{success}}</span>
        </v-snackbar>
        <v-tabs right>
            <v-tab :to="login" v-if="!isLoggedIn"><v-icon>{{icons.mdiLoginVariant}}</v-icon></v-tab>
            <v-tab :to="register" v-if="!isLoggedIn"><v-icon>{{icons.mdiAccountPlus}}</v-icon></v-tab>
        </v-tabs>
        <v-btn right @click='logout' v-if="isLoggedIn"><v-icon>{{icons.mdiLogout}}</v-icon></v-btn>
    </v-app-bar>
</nav>
</template>

<script>
import {
    mdiLoginVariant,
    mdiAccountPlus,
    mdiLogout
  } from '@mdi/js'

import { mapGetters } from 'vuex'
  export default {
    data: () => ({
     home: '/',
     login: '/login',
     register: '/register',
     icons: {
        mdiLoginVariant,
        mdiAccountPlus,
        mdiLogout
    },
    }),
    methods: {
        logout(){
            this.$store.dispatch('currentUser/logoutUser')
        },
    },
    computed: {
        ...mapGetters({
            isLoggedIn: 'currentUser/user',
            getError: 'errors/errors',
            getSuccess: 'errors/success',
        }),
        error: {
            get() {
                return this.getError;
            },
            set(getError) {
                return this.getError;
            }
        },
        success: {
            get() {
                return this.getSuccess;
            },
            set(getSuccess) {
                return this.getSuccess;
            }
        }
    }
 }
</script>

<style scoped>
    ::v-deep .v-snack__wrapper {
        min-width: 0px;
    }
</style>
