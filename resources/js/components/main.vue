<template>
    <v-app id="main_app">
        <v-overlay v-if="this.loading">

        </v-overlay>
        <navbar></navbar>
        <sidebar></sidebar>
        <v-main id="main_body">
             <v-slide-x-transition mode="out-in">
                    <router-view transition="slide-x-transition"></router-view>
             </v-slide-x-transition>
        </v-main>
    </v-app>
</template>

<script>

import { mapGetters } from 'vuex'

export default{
 computed: {
        ...mapGetters({
            loading: 'errors/loading'
        })
    }
}
</script>
