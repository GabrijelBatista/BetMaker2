/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
import Vue from 'vue';
window.axios = require('axios')

import router from './router'
import vuetify from './vuetify'
import store from './store/index'

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('main-component', require('./components/main').default);
Vue.component('navbar', require('./components/navbar.vue').default);
Vue.component('sidebar', require('./components/sidebar.vue').default);
Vue.component('register', require('./components/pages/register.vue').default);
Vue.component('login', require('./components/pages/login.vue').default);
Vue.component('templates', require('./components/pages/templates.vue').default);
Vue.component('backgrounds', require('./components/pages/backgrounds.vue').default);
Vue.component('teams', require('./components/pages/teams.vue').default);
Vue.component('competitions', require('./components/pages/competitions.vue').default);
Vue.component('matches', require('./components/pages/matches.vue').default);
Vue.component('superadmin', require('./components/pages/superadmin.vue').default);
Vue.component('verification', require('./components/pages/verification.vue').default);
Vue.component('password', require('./components/pages/password.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */



const app = new Vue({
    el: '#app',
    store,
    vuetify,
    router,
});
