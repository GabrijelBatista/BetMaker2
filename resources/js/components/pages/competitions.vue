<template>
<v-card fluid class="fill-height" id="main_content" v-if="this.selected_competitions">
    <v-tabs id="second_tabs"
            height="35px"
            dark
            app
            v-model="selected_tab"
    >
                <v-tab class="navbar_tabs" @click="select_my_competitions()"><v-icon>{{ icons.mdiStar }}</v-icon></v-tab>
                <v-tab class="navbar_tabs" @click="select_other_competitions()"><v-icon>{{ icons.mdiApps }}</v-icon></v-tab>
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
                    class="navbar_tabs"
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                    ><v-icon>{{ icons.mdiPlus }}</v-icon></v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="card_title justify-center">
                            Dodaj natjecanje
                        </v-card-title>
                        <v-form @submit.prevent="add_competition" ref="form">
                            <v-text-field
                            label="Prilog"
                            required
                            dark
                            v-model="competition_form.title"
                            autocomplete="off"
                            ></v-text-field>
                            <v-text-field
                            label="* Naziv"
                            required
                            dark
                            v-model="competition_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col v-if="superadmin" class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="users_list"
                                    label="Odaberi korisnika"
                                    dark
                                    v-model="competition_form.user"
                                    outlined
                                    item-text="email"
                                ></v-autocomplete>
                            </v-col>
                            <v-file-input
                                label="* Logo:"
                                filled
                                dark
                                v-model="competition_form.logo"
                                prepend-icon="mdi-camera"
                            ></v-file-input>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            class="mr-4"
                            type="submit"
                            @click="dialog = false"
                            >
                            POTVRDI
                            </v-btn>
                                <v-btn
                                    class="mr-4"
                                    @click="dialog = false"
                                >
                                    ODUSTANI
                                </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
    </v-tabs>
    <v-icon id="info_icon" v-bind:color="overlay ? 'green' : 'white'" @click="overlay=!overlay">{{ icons.mdiInformation }}</v-icon>
    <v-layout wrap >
        <v-container class="empty_alert" v-if="empty==true && selected_tab==0">Niste dodali svoja natjecanja. <v-btn @click="select_other_competitions()" color="green">Pogledajte</v-btn> natjecanja koja su zajednička svim korisnicima.</v-container>
        <v-container class="empty_alert2" v-if="empty==true && admin===true && selected_tab==0">Ili <v-btn @click="dialog=true" color="green">Dodajte</v-btn> svoja natjecanja.</v-container>
    <v-flex id="competitions_list" v-for="competition in this.selected_competitions.data" :key="competition.id">
        <v-hover>
            <template v-slot:default="{ hover }">
        <v-container max-width="150px" id="competition_card">
            <v-img
              :src="competition.logo ? 'storage/competitions/'+competition.logo : ''"
              lazy-src="storage/lazy_image.jpg"
              class="competition_logo"
              contain
              max-width="150px"
              max-height="150px"
            >
                <v-fade-transition>
                    <v-overlay
                        v-if="hover || overlay"
                        absolute
                        color="#036358"
                    >
                        <b>
                            {{competition.name}}
                        </b>
                        <v-divider></v-divider>
                        <div v-if="selected_competitions===my_competitions">
                            <v-icon
                                color="red"
                                class="card-icon"
                                v-on:click.stop
                                @click="delete_competition(competition.id)">
                                {{ icons.mdiDelete }}
                            </v-icon>
                        </div>
                    </v-overlay>
                </v-fade-transition>
            <template v-slot:placeholder>
                <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
                >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
            </template>
            </v-img>
        </v-container>
            </template>
        </v-hover>
    </v-flex>
    </v-layout>
    <v-pagination
    id="pagination_buttons"
    v-if="selected_competitions.last_page>1"
      v-model="pagination_details.page"
      :length="pagination_details.lenght"
      :total-visible="7"
      circle
      @input="pagination"
    ></v-pagination>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    mdiApps,
    mdiStar,
    mdiPlus,
    mdiDelete,
    mdiInformation
  } from '@mdi/js'
export default{
    data: () => ({
        empty: false,
        overlay: false,
        selected_tab: 0,
        competition_form: {
            title: "",
            name: "",
            user: "",
            logo: null,
        },
        icons: {
            mdiDelete,
            mdiApps,
            mdiStar,
            mdiPlus,
            mdiInformation
        },
        dialog: false,
        show_icons:true,
    }),
    computed: {
        ...mapGetters({
            selected_competitions: 'competitions/selectedCompetitions',
            my_competitions: 'competitions/myCompetitions',
            other_competitions: 'competitions/otherCompetitions',
            failedLogin: 'errors/errors',
            admin: 'currentUser/admin',
            superadmin: 'currentUser/superadmin',
            users_list: 'superadmin/usersList',
            pagination_details: 'competitions/paginationDetails',
            selected_competitions_watcher: 'competitions/selectedCompetitionsWatcher',
        }),
    },
    methods: {
        select_my_competitions(){
            this.$store.dispatch('competitions/selectCompetitions', this.my_competitions);
            if(this.my_competitions.data[0]==null){
                this.empty=true;
            }
        },
        select_other_competitions(){
            this.$store.dispatch('competitions/selectCompetitions', this.other_competitions);
            this.empty=false;
            this.selected_tab=1;
        },
        add_competition(){
            this.$store.dispatch('competitions/addCompetition', this.competition_form);
            this.$refs.form.reset();
        },
        delete_competition(competition){
            let response=confirm("Da li ste sigurni?");
            if(response){
            this.$store.dispatch('competitions/deleteCompetition', competition);
            }
        },
        pagination(){
            this.$store.dispatch('backgrounds/getBackgrounds');
        }
    },

    watch: {
        selected_competitions: function () {
            if(this.selected_competitions.data[0]!=null){
                this.empty=false;
            }
            else{
                this.empty=true;
            }
        },
    },

    created(){
       this.$store.dispatch('competitions/getCompetitions');
    },
    mounted(){
            if (this.my_competitions != null) {
                if(this.my_competitions.data!=undefined) {
                    if (this.my_competitions.data[0] == null) {
                        this.select_other_competitions();
                    }
                }
            }
            else{
                this.empty=true;
            }
            if (this.selected_competitions_watcher == "other") {
                this.selected_tab = 1;
            }
    }
}

</script>
