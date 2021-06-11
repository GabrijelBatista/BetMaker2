<template>
<v-card fluid class="fill-height" id="main_content" v-if="this.selected_backgrounds">
    <v-tabs id="second_tabs"
            dark
            height="35px"
            app
            v-model="selected_tab"
    >
                <v-tab class="navbar_tabs" @click="select_my_backgrounds()"><v-icon>{{ icons.mdiStar }}</v-icon></v-tab>
                <v-tab  class="navbar_tabs" @click="select_other_backgrounds()"><v-icon>{{ icons.mdiApps }}</v-icon></v-tab>
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
                            Dodaj pozadinu
                        </v-card-title>
                        <v-form @submit.prevent="add_background" ref="form">
                            <v-text-field
                            label="* Naziv"
                            required
                            dark
                            v-model="background_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col v-if="superadmin" class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="users_list"
                                    dark
                                    label="Odaberi korisnika"
                                    v-model="background_form.user"
                                    outlined
                                    menu-props="auto"
                                    item-text="email"
                                ></v-autocomplete>
                            </v-col>
                            <v-file-input
                                label="* Dodaj sliku:"
                                dark
                                filled
                                v-model="background_form.image"
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
        <v-container class="empty_alert" v-if="empty===true && selected_tab==0">Niste dodali svoje pozadine. <v-btn @click="select_other_backgrounds()" color="green">Pogledajte</v-btn> pozadine koje su zajedničke svim korisnicima.</v-container>
        <v-container class="empty_alert2" v-if="empty==true && admin===true && selected_tab==0">Ili <v-btn @click="dialog=true" color="green">Dodajte</v-btn> svoje pozadine.</v-container>
        <v-flex id="backgrounds_list" v-for="background in this.selected_backgrounds.data" :key="background.id">
        <v-hover>
            <template v-slot:default="{ hover }">
        <v-card max-width="150px" active-class="selected" :class="current_background.id === background.id ? 'selected' : ''" @click="select_current_background(background)" id="background_card">
            <v-fade-transition>
                <v-overlay
                    v-if="hover || overlay"
                    absolute
                    color="#036358"
                >
                    <b>
                        {{background.name}}
                    </b>
                    <v-divider></v-divider>
                    <div v-if="selected_backgrounds===my_backgrounds">
                        <v-icon
                            color="red"
                            class="card-icon"
                            v-on:click.stop
                            @click="delete_background(background.id)">
                            {{ icons.mdiDelete }}
                        </v-icon>
                    </div>
                </v-overlay>
            </v-fade-transition>
            <v-img
                :src="background.url ? 'storage/backgrounds/'+background.url : ''"
              lazy-src="storage/lazy_image.jpg"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                max-height="150px"
                contain
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
            </v-img>
        </v-card>

            </template>
        </v-hover>
    </v-flex>
    </v-layout>
    <v-pagination
    id="pagination_buttons"
    v-if="selected_backgrounds.last_page>1"
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
    mdiDelete,
    mdiApps,
    mdiStar,
     mdiPlus,
    mdiInformation
  } from '@mdi/js'
export default{
    data: () => ({
        empty: false,
        selected_tab: 0,
        overlay: false,
        background_form: {
            name: "",
            user: "",
            image: null,
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
            selected_backgrounds: 'backgrounds/selectedBackgrounds',
            my_backgrounds: 'backgrounds/myBackgrounds',
            other_backgrounds: 'backgrounds/otherBackgrounds',
            current_background: 'backgrounds/currentBackground',
            failedLogin: 'errors/errors',
            admin: 'currentUser/admin',
            superadmin: 'currentUser/superadmin',
            users_list: 'superadmin/usersList',
            current_template: 'templates/currentTemplate',
            pagination_details: 'backgrounds/paginationDetails',
            selected_backgrounds_watcher: 'backgrounds/selectedBackgroundsWatcher',
        }),
    },
    methods: {
        select_my_backgrounds(){
            this.$store.dispatch('backgrounds/selectBackgrounds', this.my_backgrounds);
            if(this.my_backgrounds.data[0]==null){
                this.empty=true;
            }
        },
        select_other_backgrounds(){
            this.$store.dispatch('backgrounds/selectBackgrounds', this.other_backgrounds);
            this.empty=false;
            this.selected_tab=1;
        },
        add_background(){
            this.$store.dispatch('backgrounds/addBackground', this.background_form);
            this.$refs.form.reset();
            this.selected_tab = 0;
        },
        select_current_background(background){
            background.template_url=this.current_template.url;
            this.$store.dispatch('backgrounds/currentBackground', background);
        },
        delete_background(background){
            let response=confirm("Da li ste sigurni?");
            if(response){
            this.$store.dispatch('backgrounds/deleteBackground', background);
            }
        },
        pagination(){
            this.$store.dispatch('backgrounds/getBackgrounds');
        }
    },

    watch: {
        selected_backgrounds: function () {
            if(this.selected_backgrounds.data[0]!=null){
                this.empty=false;
            }
            else{
                this.empty=true;
            }
        },
    },

    created() {
        this.$store.dispatch('backgrounds/getBackgrounds');
    },
    mounted(){
        if(this.my_backgrounds!=null){
            if(this.my_backgrounds.data!=undefined) {
                if (this.my_backgrounds.data[0] == null) {
                    this.select_other_backgrounds();
                }
            }
        }
        else{
            this.empty=true;
        }
        if(this.selected_backgrounds_watcher=="other"){
            this.selected_tab=1;
        }
    }
}

</script>
