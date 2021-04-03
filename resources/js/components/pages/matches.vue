<template>
<v-card fluid class="fill-height" id="main_content">
    <v-tabs id="second_tabs"
            background-color="light grey"
            dark
            app
            v-if="admin"
            >
            <v-spacer></v-spacer>
                <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="dialog"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                        id="add_match_tab"
                    >Dodaj meč</v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Dodaj meč
                        </v-card-title>
                        <v-form @submit.prevent="add_match" ref="form">
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="teams_list"
                                    label="Domaćin:"
                                    v-model="match_form.home_team"
                                    outlined
                                    item-text="name"
                                ></v-select>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="teams_list"
                                    label="Gost:"
                                    item-text="name"
                                    v-model="match_form.away_team"
                                    outlined
                                ></v-select>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="competitions_list"
                                    label="Natjecanje:"
                                    item-text="name"
                                    v-model="match_form.competition"
                                    outlined
                                ></v-select>
                            </v-col>
                            <v-row class="date_time_picker">
                            <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                            >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="match_form.date"
                                label="Odaberi datum:"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker class="calendar_clock" v-model="match_form.date" @input="menu2 = false"></v-date-picker>
                            </v-menu>
                            <v-spacer></v-spacer>
                            <v-col cols="11" sm="5">
                                <v-menu
                                    ref="menu"
                                    v-model="menu3"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="match_form.time"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="match_form.time"
                                        label="Odaberi vrijeme:"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-time-picker
                                    v-if="menu3"
                                    v-model="match_form.time"
                                    @click:minute="$refs.menu.save(match_form.time)"
                                    ></v-time-picker>
                                </v-menu>
                                </v-col>
                            </v-row>
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
    <v-flex id="teams_list" v-for="match in this.matches_list" :key="match.id">

    </v-flex>
    </v-layout>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    mdiPencil,
    mdiDelete,
  } from '@mdi/js'
export default{
    data: () => ({
        menu2: false,
        menu3: false,
        match_form: {
            home_team: null,
            away_team: null,
            competition: null,
            date: new Date().toISOString().substr(0, 10),
            time: null,
        },
        icons: {
            mdiDelete
        },
        dialog: false,
        show_icons:true,
    }),
    computed: {
        ...mapGetters({
            selected_matches: 'matches/selectedMatches',
            matches_list: 'matches/matches',
            failedLogin: 'errors/errors',
            admin: 'currentUser/admin',
            superadmin: 'currentUser/superadmin',
            competitions_list: 'competitions/competitionsList',
            teams_list: 'teams/teamsList',
        }),
    },
    methods: {
        select_matches(){
            this.$store.dispatch('matches/selectMatches', this.matches);
        },
        add_match(){
            this.$store.dispatch('matches/addMatch', this.match_form);
            this.$refs.form.reset();
        },
        delete_match(match){
            let response=confirm("Da li ste sigurni?");
            if(response){
            this.$store.dispatch('matches/deleteMatch', match);
            }
        },

    },

    mounted(){
        this.$store.dispatch('matches/getMatchesResources');
    }
}

</script>


