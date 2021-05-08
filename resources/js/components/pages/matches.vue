<template>
<v-card fluid class="fill-height" id="main_content">
    <v-tabs id="second_tabs"
            background-color="light grey"
            dark
            app
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
                                <v-autocomplete
                                    :items="teams_list"
                                    label="Domaćin:"
                                    v-model="match_form.home_team"
                                    outlined
                                    item-text="name"
                                ></v-autocomplete>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="teams_list"
                                    label="Gost:"
                                    item-text="name"
                                    v-model="match_form.away_team"
                                    outlined
                                ></v-autocomplete>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="competitions_list"
                                    label="Natjecanje:"
                                    item-text="name"
                                    v-model="match_form.competition"
                                    outlined
                                ></v-autocomplete>
                            </v-col>
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
                                :prepend-icon="icons.mdiCalendar"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            class="calendar_clock"
                            v-model="match_form.date"
                            @input="menu2 = false"
                            :first-day-of-week="1"
                            locale="hr-HR">
                            </v-date-picker>
                            </v-menu>
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
                                        :prepend-icon="icons.mdiClock"
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
                                    format="24hr"
                                    ></v-time-picker>
                            </v-menu>
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
            <v-data-table
            v-if="matches_list"
            v-model="matches_send"
            :headers="headers"
            :items="matches_list"
            item-key="id"
            class="elevation-1"
            :items-per-page="5"
            :footer-props="{
            showFirstLastPage: true,
            firstIcon: icons.mdiArrowCollapseLeft,
            lastIcon: icons.mdiArrowCollapseRight,
            prevIcon: icons.mdiArrowCollapseMinus,
            nextIcon: icons.mdiArrowCollapsePlus,
            'items-per-page-text':'Stavki po stranici:'
            }">
                <template v-slot:item="{ item, isSelected, select }">
                    <tr id="matches_table" :class="isSelected?'cyan':''" @click="toggle(isSelected,select,$event)">
                        <td>{{item.home_team}}</td>
                        <td>{{item.away_team}}</td>
                        <td>{{item.competition}}</td>
                        <td>{{item.date}}</td>
                        <td>{{item.time}}</td>
                        <v-icon class="px-1" color="green" v-show="isSelected">{{ icons.mdiCheck }}</v-icon>
                        <v-icon class="px-1" color="red" @click="delete_match(item.id)">{{ icons.mdiDelete }}</v-icon>
                    </tr>
                </template>
            </v-data-table>
    </v-layout>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    mdiCheck,
    mdiDelete,
    mdiArrowCollapseLeft,
    mdiArrowCollapseRight,
    mdiMinus,
    mdiPlus,
    mdiCalendar,
    mdiClock
  } from '@mdi/js'
export default{
    data: () => ({
        matches_send: [],
        headers: [
        { text: "Domaćin", value: "home_team" },
        { text: "Gost", value: "away_team" },
        { text: "Natjecanje", value: "competition" },
        { text: "Datum", value: "date" },
        { text: "Vrijeme", value: "time" }
      ],
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
            mdiDelete,
            mdiCheck,
            mdiArrowCollapseLeft,
            mdiArrowCollapseRight,
            mdiMinus,
            mdiPlus,
            mdiCalendar,
            mdiClock
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
        toggle(isSelected,select,e) {
            select(!isSelected);
        },

    },

    created(){
        this.matches_send=this.selected_matches;
        this.$store.dispatch('matches/getMatchesResources');
    },

    watch: {
      matches_send: function() {
          this.$store.dispatch('matches/selectMatches', this.matches_send);
      }
  }
}

</script>


