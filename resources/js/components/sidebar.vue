<template>
 <v-navigation-drawer
 app
      permanent
      left
      dark
 :mini-variant="$vuetify.breakpoint.smAndDown"
      id="sidebar"
    >

      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar id="app_logo">
            <img :src="'storage/logo2.png'">
          </v-list-item-avatar>

          <v-list-item-content id="logo" v-if="$vuetify.breakpoint.mdAndUp">
            <div>BETMAKER</div>
          </v-list-item-content>
        </v-list-item>
      </template>


      <v-divider></v-divider>

        <v-list rounded>
      <v-list-item-group
        color="primary"
        v-if="this.current_template"
      >
        <v-list-item
          v-if="superadmin"
          :to="superadmin_link"
        >
            <v-list-item-content>
                <v-icon medium v-if="$vuetify.breakpoint.smAndDown">{{icons.mdiAccountCircle}}</v-icon>
                <v-list-item-title class="sidebar_list">ADMIN</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item
          class="current_template_tab sidebar_tabs"
          :to="this.current_template.url"
        >
            <v-list-item-content>
                <v-icon color="black" large v-if="$vuetify.breakpoint.smAndDown">{{icons.mdiStarCircle}}</v-icon>
                <v-list-item-title id="current_template_tab" v-if="$vuetify.breakpoint.mdAndUp" class="sidebar_list">ODABRANI PREDLOŽAK</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.link"
        >
          <v-list-item-content>
            <v-icon medium v-if="$vuetify.breakpoint.smAndDown">{{item.icon}}</v-icon>
            <v-list-item-title v-if="$vuetify.breakpoint.mdAndUp" class="sidebar_list" v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
 </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    mdiAccountCircle,
    mdiImageMultiple,
    mdiWallpaper,
    mdiAccountSupervisorCircle,
    mdiSwordCross,
    mdiBasketball,
    mdiStarCircle,
  } from '@mdi/js'
  export default {
    data: () => ({
        icons: {
            mdiAccountCircle,
            mdiImageMultiple,
            mdiWallpaper,
            mdiAccountSupervisorCircle,
            mdiSwordCross,
            mdiBasketball,
            mdiStarCircle,
        },
        items: [
            { text: 'Predlošci', link: '/', icon: mdiWallpaper},
            { text: 'Pozadine', link: '/backgrounds', icon: mdiImageMultiple},
            { text: 'Natjecanja', link: '/competitions', icon: mdiBasketball},
            { text: 'Timovi/Igrači', link: '/teams', icon: mdiAccountSupervisorCircle},
            { text: 'Mečevi', link: '/matches', icon: mdiSwordCross},
        ],
        superadmin_link: "/superadmin"
        }),
        computed: {
            ...mapGetters({
                admin: 'currentUser/admin',
                superadmin: 'currentUser/superadmin',
                current_template: 'templates/currentTemplate',
                user: 'currentUser/user'
            }),
        },
  }
</script>

<style scoped>
    ::v-deep .v-list-item {
        padding:0 0 !important;
    }
</style>
