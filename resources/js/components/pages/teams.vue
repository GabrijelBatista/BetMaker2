<template>
<v-card fluid class="fill-height" id="main_content">
    <v-tabs id="second_tabs"
            background-color="light grey"
            dark
            app
            >
                <v-tab @click="select_my_teams()">Moji timovi/igrači</v-tab>
                <v-tab @click="select_other_teams()">Ostali timovi/igrači</v-tab>
                <v-spacer></v-spacer>
                <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="dialog"
                v-if="admin"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                    >Dodaj tim/igrača</v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Dodaj tim/igrača
                        </v-card-title>
                        <v-form @submit.prevent="add_team" ref="form">
                            <v-text-field
                            label="Prilog"
                            required
                            v-model="team_form.title"
                            autocomplete="off"
                            ></v-text-field>
                            <v-text-field
                            label="Naziv"
                            required
                            v-model="team_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col v-if="superadmin" class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="users_list"
                                    label="Odaberi korisnika"
                                    v-model="team_form.user"
                                    outlined
                                    item-text="email"
                                ></v-autocomplete>
                            </v-col>
                            <v-file-input
                                label="Dodaj sliku:"
                                filled
                                v-model="team_form.logo"
                                prepend-icon="mdi-camera"
                            ></v-file-input>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            id="login-button"
                            class="mr-4"
                            type="submit"
                            @click="dialog = false"
                            >
                            POTVRDI
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
    </v-tabs>
    <v-layout wrap >
    <v-flex id="teams_list" v-for="team in this.selected_teams" :key="team.id">
            <v-img
              :src="'storage/teams/'+team.logo"
              lazy-src="storage/lazy_image.jpg"
              class="competition_logo"
            >
            <template v-slot:placeholder>
                <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
                >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
            </template>
            <div v-if="selected_teams===my_teams">
                <v-icon
                color="red"
                class="card-icon"
                v-on:click.stop
                @click="delete_team(team.id)">
                    {{ icons.mdiDelete }}
                </v-icon>
            </div>
            </v-img>
            <v-card-title
                class="justify-center"
                v-text="team.title+' '+team.name">
            </v-card-title>
    </v-flex>
    </v-layout>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    mdiDelete,
  } from '@mdi/js'
export default{
    data: () => ({
        team_form: {
            title: "",
            name: "",
            user: "",
            logo: null,
        },
        icons: {
            mdiDelete
        },
        dialog: false,
        show_icons:true,
    }),
    computed: {
        ...mapGetters({
            selected_teams: 'teams/selectedTeams',
            my_teams: 'teams/myTeams',
            other_teams: 'teams/otherTeams',
            failedLogin: 'errors/errors',
            admin: 'currentUser/admin',
            superadmin: 'currentUser/superadmin',
            users_list: 'superadmin/usersList',
        }),
    },
    methods: {
        select_my_teams(){
            this.$store.dispatch('teams/selectTeams', this.my_teams);
        },
        select_other_teams(){
            this.$store.dispatch('teams/selectTeams', this.other_teams);
        },
        add_team(){
            this.$store.dispatch('teams/addTeam', this.team_form);
            this.$refs.form.reset();
        },
        delete_team(team){
            let response=confirm("Da li ste sigurni?");
            if(response){
            this.$store.dispatch('teams/deleteTeam', team);
            }
        },
    },

    created(){
       this.$store.dispatch('teams/getTeams');
    }
}

</script>

