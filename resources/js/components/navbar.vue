<template>
<nav>
    <v-app-bar app id="navbar" dense dark>
        <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="help_dialog"
                >
                    <v-card id="dialog_box">
                        <v-card-title class="card_title justify-center">
                            Informacije
                        </v-card-title>
                            <v-row class="dialog_row" cols="12" sm="6" >
                            <v-card-text class="card_text">
                                Za sve informacije možete nas kontaktirati putem e-mail adrese:
                                <strong>batist_gabrijel1@hotmail.com</strong>
                            </v-card-text>
                            </v-row>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    class="mr-4"
                                    @click="help_dialog = false"
                                >
                                    ZATVORI
                                </v-btn>
                            </v-card-actions>
                    </v-card>
        </v-dialog>
        <v-snackbar class="alert_snackbar" v-model="success" transition="fade-transition" :timeout="2000" color="green">
            <span>{{success}}</span>
        </v-snackbar>
        <v-snackbar class="alert_snackbar" v-model="error" transition="fade-transition" :timeout="3000" color="red">
            <div v-for="err in error" :key="err[0]"><span>{{err[0]}}</span></div>
        </v-snackbar>
        <v-tabs right>
            <v-icon v-bind:color="help_dialog ? 'green' : 'white'" dark left @click="help_dialog=true" class="help-icon">{{icons.mdiHelpCircle}}</v-icon>
            <v-spacer></v-spacer>
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
    mdiLogout,
    mdiHelpCircle,
  } from '@mdi/js'

import { mapGetters } from 'vuex'
  export default {
    data: () => ({
     help_dialog: false,
     home: '/',
     login: '/login',
     register: '/register',
     icons: {
        mdiLoginVariant,
        mdiAccountPlus,
        mdiLogout,
        mdiHelpCircle
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
