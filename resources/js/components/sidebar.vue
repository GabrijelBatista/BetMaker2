<template>
 <v-navigation-drawer
 app
      permanent
      left
      dark
      id="sidebar"
    >

      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title id="logo">BetMaker</v-list-item-title>
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
                <v-list-item-title>ADMIN</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item
          class="current_template_tab"
          :to="this.current_template.url"
        >
            <v-list-item-content>
                <v-list-item-title>ODABRANI PREDLOŽAK</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.link"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
 </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    data: () => ({
        items: [
            { text: 'Predlošci', link: '/'},
            { text: 'Pozadine', link: '/backgrounds'},
            { text: 'Natjecanja', link: '/competitions'},
            { text: 'Timovi/Igrači', link: '/teams'},
            { text: 'Mečevi', link: '/matches'},
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
