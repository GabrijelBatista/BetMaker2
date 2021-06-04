<template>
<v-card fluid class="fill-height" id="main_content">
    <v-tabs id="second_tabs"
            dark
            height="35px"
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
                        class="navbar_tabs"
                        v-on="on"
                        id="add_match_tab"
                    ><v-icon>{{icons.mdiPlus}}</v-icon></v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="card_title justify-center">
                            Dodaj meč
                        </v-card-title>
                        <v-form @submit.prevent="add_match" ref="form">
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-combobox
                                dark
                                    :items="entries_home"
                                    :filter="entries_home_filter"
                                    :search-input.sync="search_home"
                                    label="* Domaćin:"
                                    v-model="match_form.home_team"
                                    outlined
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                >
                                </v-combobox>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-combobox
                                dark
                                    :items="entries_away"
                                    :filter="entries_away_filter"
                                    :search-input.sync="search_away"
                                    label="* Gost:"
                                    v-model="match_form.away_team"
                                    outlined
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                >
                                </v-combobox>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-combobox
                                dark
                                    :items="entries_competition"
                                    :filter="entries_competition_filter"
                                    :search-input.sync="search_competition"
                                    label="Natjecanje:"
                                    v-model="match_form.competition"
                                    outlined
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                >
                                </v-combobox>
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
                            dark
                                v-model="match_form.date"
                                label="Odaberi datum:"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :prepend-inner-icon="icons.mdiCalendar"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            dark
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
                                    dark
                                        :prepend-inner-icon="icons.mdiClock"
                                        v-model="match_form.time"
                                        label="Odaberi vrijeme:"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-time-picker
                                    dark
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
                        <td>{{item.home_team.name}}</td>
                        <td>{{item.away_team.name}}</td>
                        <td>{{item.competition.name}}</td>
                        <td>{{item.date}}</td>
                        <td>{{item.time}}</td>
                        <td v-show="isSelected"><v-icon class="px-1" color="green" v-show="isSelected">{{ icons.mdiCheck }}</v-icon></td>
                        <td><v-icon class="px-1" color="red" v-on:click.stop @click="delete_match(item.id)">{{ icons.mdiDelete }}</v-icon></td>
                    </tr>
                </template>
            </v-data-table>
    </v-layout>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
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
        entries_home: [],
        search_home: null,
        entries_away: [],
        search_away: null,
        entries_competition: [],
        search_competition: null,
        matches_send: [],
        headers: [
        { text: "Domaćin", value: "home_team" },
        { text: "Gost", value: "away_team" },
        { text: "Natjecanje", value: "competition" },
        { text: "Datum", value: "date" },
        { text: "Vrijeme", value: "time" },
      ],
        menu2: false,
        menu3: false,
        match_form: {
            home_team: "",
            away_team: "",
            competition: "",
            date: null,
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
        }),
    },
    methods: {
        select_matches(){
            this.$store.dispatch('matches/selectMatches', this.matches);
        },
        add_match(){
            if(this.match_form.date!=null){
               // moment.locale('hr');
                let new_date=moment(String(this.match_form.date)).format('DD/MM/YYYY.');
                this.match_form.date=new_date;
            }
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
        entries_home_filter(){
            return this.entries_home;
        },
        entries_away_filter(){
            return this.entries_away;
        },
        entries_competition_filter(){
            return this.entries_competition;
        }
    },

    created(){
        this.matches_send=this.selected_matches;
        if(this.matches_list==null) {
            this.$store.dispatch('matches/getMatches');
        }
    },

    watch: {
      matches_send: function() {
          this.$store.dispatch('matches/selectMatches', this.matches_send);
      },
      search_home (val1) {
          this.entries_home = [];
          if(!val1) return;
          if(val1.length<2 || val1==null) return;
      axios.get('/api/autocomplete_teams/'+val1)
        .then(res => {
            this.entries_home=null;
            this.entries_home = res.data[0];
        })
        .catch(err => {
          console.log(err)
        })
    },
    search_away (val2) {
          this.entries_away = [];
        if(!val2) return;
        if(val2.length<2) return;
      axios.get('/api/autocomplete_teams/'+val2)
        .then(res => {
            this.entries_away=null;
            this.entries_away = res.data[0];
        })
        .catch(err => {
          console.log(err)
        })
    },
    search_competition (val3) {
          this.entries_competition = [];
        if(!val3) return;
        if(val3.length<2 || val3==null) return;
      axios.get('/api/autocomplete_competitions/'+val3)
        .then(res => {
            this.entries_competition=null;
            this.entries_competition = res.data;
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}

</script>


