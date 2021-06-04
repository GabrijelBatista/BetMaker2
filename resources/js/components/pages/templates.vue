<template>
<v-card fluid class="fill-height" id="main_content" v-if="this.current_template">
    <v-tabs id="second_tabs"
            dark
            height="35px"
            app
            v-model="selected_tab"
            >
        <v-tab class="navbar_tabs" @click="select_my_templates()"><v-icon>{{ icons.mdiStar }}</v-icon></v-tab>
        <v-tab class="navbar_tabs" @click="select_other_templates()"><v-icon>{{ icons.mdiApps }}</v-icon></v-tab>
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
                        v-if="superadmin"
                    ><v-icon>{{ icons.mdiPlus }}</v-icon></v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="card_title justify-center">
                            Dodaj predložak
                        </v-card-title>
                        <v-form @submit.prevent="add_template" ref="form">
                            <v-text-field
                            label="* Naziv"
                            dark
                            required
                            v-model="template_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-text-field
                            label="* Maksimalan broj mečeva"
                            dark
                            required
                            v-model="template_form.max_matches"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="users_list"
                                    label="* Choose user"
                                    v-model="template_form.user"
                                    dark
                                    outlined
                                    menu-props="auto"
                                    item-text="email"
                                ></v-autocomplete>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="aspects"
                                    label="* Choose aspect"
                                    dark
                                    v-model="template_form.aspect"
                                    outlined
                                    menu-props="auto"
                                    item-text="name"
                                ></v-autocomplete>
                            </v-col>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            class="login-button"
                            type="submit"
                            @click="dialog = false"
                            >
                            POTVRDI
                            </v-btn>
                            <v-btn
                            class="login-button"
                            @click="dialog = false"
                            >
                            Odustani
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
    </v-tabs>
    <v-layout wrap>
    <v-flex id="templates_list" v-for="template in this.selected_templates.data" :key="template.id">
        <v-hover>
            <template v-slot:default="{ hover }">
        <v-card active-class="selected"
        :class="current_template.id === template.id ? 'selected' : ''"
        @click="select_current_template(template)"
        :id="'template_card'"
        :aspect-ratio="template.aspect_id==1 ? 9/16 : '' || template.aspect_id==2 ? 16/9 : '' || template.aspect_id==3 ? 1/1 : ''"
        :width="template.aspect_id==1 ? 150 : '' || template.aspect_id==2 ? 267 : '' || template.aspect_id==3 ? 209 : ''"
        >
            <v-img
              :src="template.example_image ? 'storage/example_images/'+template.example_image : ''"
              lazy-src="storage/lazy_image.jpg"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              :height="template.aspect_id==1 ? 267 : '' || template.aspect_id==2 ? 150 : '' || template.aspect_id==3 ? 267 : ''"
            >
                <v-fade-transition>
                    <v-overlay
                        v-if="hover"
                        absolute
                        color="#036358"
                    >
                        <b>
                            {{template.name}}
                        </b>
                        <br/>
                        <small>
                            Matches: ({{template.max_matches}})
                        </small>
                        <v-divider></v-divider>
                        <v-icon
                            color="orange"
                            v-if="superadmin"
                            @click.stop="edit_dialog(template)"
                            class="card-icon">
                            {{ icons.mdiPencil }}
                        </v-icon>
                        <v-icon color="red"
                                v-if="superadmin"
                                v-on:click.stop
                                @click="delete_template(template.id)"
                                class="card-icon">
                            {{ icons.mdiDelete }}
                        </v-icon>
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
        </v-card>
            </template>
        </v-hover>
    </v-flex>
    <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="dialog3"
                >
                    <v-card id="dialog_box">
                        <v-card-title class="card_title justify-center">
                            EDIT {{this.dialog_template_name}}
                        </v-card-title>
                        <v-form @submit.prevent="edit_template" ref="form">
                            <v-text-field
                            label="Naziv"
                            dark
                            v-model="edit_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-text-field
                            label="Maksimalan broj mečeva"
                            v-model="edit_form.max_matches"
                            dark
                            autocomplete="off"
                            ></v-text-field>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="users_list"
                                    dark
                                    label="Choose user"
                                    v-model="edit_form.user"
                                    outlined
                                    item-text="email"
                                    menu-props="auto"
                                ></v-autocomplete>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="aspects"
                                    label="Choose aspect"
                                    dark
                                    v-model="edit_form.aspect"
                                    outlined
                                    item-text="name"
                                    menu-props="auto"
                                ></v-autocomplete>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-autocomplete
                                    :items="backgrounds"
                                    label="Choose default background"
                                    dark
                                    v-model="edit_form.default_background"
                                    outlined
                                    item-text="name"
                                    menu-props="auto"
                                ></v-autocomplete>
                            </v-col>
                            <v-file-input
                                label="Dodaj sliku(primjer):"
                                dark
                                filled
                                v-model="edit_form.example_image"
                                prepend-icon="mdi-camera"
                            ></v-file-input>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            class="login-button"
                            type="submit"
                            @click="dialog3=false"
                            >
                            Potvrdi
                            </v-btn>
                            <v-btn
                            class="login-button"
                            @click="dialog3=false"
                            >
                            Odustani
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
    </v-layout>
    <v-pagination
    id="pagination_buttons"
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
    mdiPencil,
    mdiDelete,
    mdiApps,
    mdiStar,
    mdiPlus
  } from '@mdi/js'
export default{
    props: ['auth_user'],
    data: () => ({
        selected_tab: 0,

        dialog_template_name: null,
        dialog_template_id: null,
        icons: {
            mdiPencil,
            mdiDelete,
            mdiApps,
            mdiStar,
            mdiPlus
        },
        template_form: {
            name: null,
            user: null,
            max_matches: null,
            aspect: null,
        },
        edit_form: {
            id: null,
            name: null,
            user: null,
            max_matches: null,
            aspect: null,
            example_image: null,
            default_background: null
        },
        dialog: false,
        dialog3: false,
    }),

    computed: {
        ...mapGetters({
            selected_templates: 'templates/selectedTemplates',
            my_templates: 'templates/myTemplates',
            other_templates: 'templates/otherTemplates',
            current_template: 'templates/currentTemplate',
            failedLogin: 'errors/errors',
            admin: 'currentUser/admin',
            superadmin: 'currentUser/superadmin',
            aspects: 'superadmin/aspects',
            backgrounds: 'backgrounds/backgroundsList',
            users_list: 'superadmin/usersList',
            pagination_details: 'backgrounds/paginationDetails',
            selected_templates_watcher: 'templates/selectedTemplatesWatcher',
        }),
    },
    methods: {
        select_my_templates(){
           this.$store.dispatch('templates/selectTemplates', this.my_templates);
        },
        select_other_templates(){
            this.$store.dispatch('templates/selectTemplates', this.other_templates);
        },
        add_template(){
            this.$store.dispatch('templates/addTemplate', this.template_form);
            this.$refs.form.reset();
        },
        select_current_template(template){
            this.$store.dispatch('templates/currentTemplate', template);
        },
        edit_template(){
            this.edit_form.id=this.dialog_template_id;
            this.$store.dispatch('templates/editTemplate', this.edit_form);
            this.$refs.form.reset()
        },
        delete_template(template){
            let response=confirm("Da li ste sigurni?");
            if(response){
            this.$store.dispatch('templates/deleteTemplate', template);
            }
        },
        edit_dialog(template) {
            this.dialog_template_name = template.name;
            this.dialog_template_id = template.id;
            this.dialog3 = true;
        },
        pagination(){
            this.$store.dispatch('backgrounds/getBackgrounds');
        }
    },
    created(){
        this.$store.dispatch('templates/getTemplates');
        this.$store.dispatch('backgrounds/getBackgrounds');
    },
    mounted() {
        if (this.selected_templates_watcher == "other") {
            this.selected_tab = 1;
        }
    }
}

</script>
