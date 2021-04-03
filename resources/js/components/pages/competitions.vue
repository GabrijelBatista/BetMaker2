<template>
<v-card fluid class="fill-height" id="main_content">
    <v-tabs id="second_tabs"
            background-color="light grey"
            dark
            app
            v-if="admin"
            >
                <v-tab @click="select_my_competitions()">Moja natjecanja</v-tab>
                <v-tab @click="select_other_competitions()">Ostala natjecanja</v-tab>
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
                    >Dodaj natjecanje</v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Dodaj natjecanje
                        </v-card-title>
                        <v-form @submit.prevent="add_competition" ref="form">
                            <v-text-field
                            label="Prilog"
                            required
                            v-model="competition_form.title"
                            autocomplete="off"
                            ></v-text-field>
                            <v-text-field
                            label="Naziv"
                            required
                            v-model="competition_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col v-if="superadmin" class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="users_list"
                                    label="Odaberi korisnika"
                                    v-model="competition_form.user"
                                    outlined
                                    item-text="email"
                                ></v-select>
                            </v-col>
                            <v-file-input
                                label="Dodaj sliku:"
                                filled
                                v-model="competition_form.logo"
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
    <v-flex id="competitions_list" v-for="competition in this.selected_competitions" :key="competition.id">
            <v-img
              :src="'storage/competitions/'+competition.logo"
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
            <div v-if="selected_competitions===my_competitions">
                <v-icon
                color="red"
                class="card-icon"
                v-on:click.stop
                @click="delete_competition(competition.id)">
                    {{ icons.mdiDelete }}
                </v-icon>
            </div>
            </v-img>
            <v-card-title
                class="justify-center"
                v-text="competition.title+' '+competition.name">
            </v-card-title>
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
        competition_form: {
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
            selected_competitions: 'competitions/selectedCompetitions',
            my_competitions: 'competitions/myCompetitions',
            other_competitions: 'competitions/otherCompetitions',
            failedLogin: 'errors/errors',
            admin: 'currentUser/admin',
            superadmin: 'currentUser/superadmin',
            users_list: 'superadmin/usersList',
        }),
    },
    methods: {
        select_my_competitions(){
            this.$store.dispatch('competitions/selectCompetitions', this.my_competitions);
        },
        select_other_competitions(){
            this.$store.dispatch('competitions/selectCompetitions', this.other_competitions);
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
    },

    mounted(){
       this.$store.dispatch('competitions/getCompetitions');
    }
}

</script>
