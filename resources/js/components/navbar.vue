<template>
<nav>
    <v-app-bar app id="navbar" dark>
        <v-snackbar v-model="error" transition="fade-transition" :timeout="2000" color="red">
            <span>{{error}}</span>
        </v-snackbar>
        <v-snackbar v-model="success" transition="fade-transition" :timeout="2000" color="green">
            <span>{{success}}</span>
        </v-snackbar>
        <v-tabs right>
            <v-tab :to="login" v-if="!isLoggedIn">Prijava</v-tab>
            <v-tab :to="register" v-if="!isLoggedIn">Registracija</v-tab>
        </v-tabs>
        <v-btn right @click='logout' v-if="isLoggedIn">Odjavi se</v-btn>
    </v-app-bar>
</nav>
</template>

<script>

import { mapGetters } from 'vuex'
  export default {
    data: () => ({
     home: '/',
     login: '/login',
     register: '/register',
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
