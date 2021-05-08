<template>
<v-card fluid class="fill-height" id="main_content">
    <v-tabs id="second_tabs"
            background-color="light grey"
            dark
            app
            >
                <v-tab @click="select_my_backgrounds()">Moje pozadine</v-tab>
                <v-tab @click="select_other_backgrounds()">Ostale pozadine</v-tab>
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
                    >Dodaj pozadinu</v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Dodaj pozadinu
                        </v-card-title>
                        <v-form @submit.prevent="add_background" ref="form">
                            <v-text-field
                            label="Naziv"
                            required
                            v-model="background_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col v-if="superadmin" class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="users_list"
                                    label="Odaberi korisnika"
                                    v-model="background_form.user"
                                    outlined
                                    menu-props="auto"
                                    item-text="email"
                                ></v-autocomplete>
                            </v-col>
                            <v-file-input
                                label="Dodaj sliku:"
                                filled
                                v-model="background_form.image"
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
    <v-flex id="backgrounds_list" v-for="background in this.selected_backgrounds" :key="background.id">
        <v-card active-class="selected" :class="current_background.id === background.id ? 'selected' : ''" @click="select_current_background(background)" id="background_card">
            <v-img
              :src="'storage/backgrounds/'+background.name"
              lazy-src="storage/lazy_image.jpg"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="100%"
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
            <div v-if="selected_backgrounds===my_backgrounds">
                <v-icon
                color="red"
                class="card-icon"
                v-on:click.stop
                @click="delete_background(background.id)">
                    {{ icons.mdiDelete }}
                </v-icon>
            </div>
            </v-img>

        </v-card>
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
        background_form: {
            name: "",
            user: "",
            image: null,
        },
        icons: {
            mdiDelete
        },
        dialog: false,
        show_icons:true,
    }),
    computed: {
        ...mapGetters({
            selected_backgrounds: 'backgrounds/selectedBackgrounds',
            my_backgrounds: 'backgrounds/myBackgrounds',
            other_backgrounds: 'backgrounds/otherBackgrounds',
            current_background: 'backgrounds/currentBackground',
            failedLogin: 'errors/errors',
            admin: 'currentUser/admin',
            superadmin: 'currentUser/superadmin',
            users_list: 'superadmin/usersList',
            current_template: 'templates/currentTemplate',
        }),
    },
    methods: {
        select_my_backgrounds(){
            this.$store.dispatch('backgrounds/selectBackgrounds', this.my_backgrounds);
        },
        select_other_backgrounds(){
            this.$store.dispatch('backgrounds/selectBackgrounds', this.other_backgrounds);
        },
        add_background(){
            this.$store.dispatch('backgrounds/addBackground', this.background_form);
            this.$refs.form.reset();
        },
        select_current_background(background){
            background.url=this.current_template.id;
            this.$store.dispatch('backgrounds/currentBackground', background);
        },
        delete_background(background){
            let response=confirm("Da li ste sigurni?");
            if(response){
            this.$store.dispatch('backgrounds/deleteBackground', background);
            }
        },
    },

    created(){
       this.$store.dispatch('backgrounds/getBackgrounds');
    }
}

</script>
