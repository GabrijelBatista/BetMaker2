<template>
<v-card fluid class="fill-height" id="main_content">
    <v-tabs id="second_tabs"
            background-color="light grey"
            dark
            app
            v-if="admin"
            >
                <v-tab @click="select_my_templates()">Moji predlošci</v-tab>
                <v-tab @click="select_other_templates()">Ostali predlošci</v-tab>
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
                        v-if="superadmin"
                    >Dodaj predložak</v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Dodaj predložak
                        </v-card-title>
                        <v-form @submit.prevent="add_template" ref="form">
                            <v-text-field
                            label="Naziv"
                            required
                            v-model="template_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-text-field
                            label="Maksimalan broj mečeva"
                            required
                            v-model="template_form.max_matches"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="users_list"
                                    label="Choose user"
                                    v-model="template_form.user"
                                    outlined
                                    item-text="email"
                                ></v-select>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="aspects"
                                    label="Choose aspect"
                                    v-model="template_form.aspect"
                                    outlined
                                    item-text="name"
                                ></v-select>
                            </v-col>
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
                            <v-btn
                            id="login-button"
                            class="mr-4"
                            @click="dialog = false"
                            >
                            Odustani
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
    </v-tabs>
    <v-layout wrap >
    <v-flex id="templates_list" v-for="template in selected_templates" :key="template.id">
        <v-card active-class="selected" :class="current_template.id === template.id ? 'selected' : ''" @click="select_current_template(template)" :id="'template_card'+template.aspect_id">
            <v-img
              :src="template.example_image"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="100%"
            >
                <v-card-title v-text="template.name">
                </v-card-title>
                <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="dialog3"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-icon
                    color="orange"
                    v-bind="attrs"
                    v-on="on"
                    v-if="superadmin"
                    class="card-icon">
                        {{ icons.mdiPencil }}
                    </v-icon>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            EDIT {{template.name}}
                        </v-card-title>
                        <v-form @submit.prevent="edit_template" ref="form">
                            <v-text-field
                            label="Naziv"
                            v-model="edit_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-text-field
                            label="Maksimalan broj mečeva"
                            v-model="edit_form.max_matches"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="users_list"
                                    label="Choose user"
                                    v-model="edit_form.user"
                                    outlined
                                    item-text="email"
                                ></v-select>
                            </v-col>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="aspects"
                                    label="Choose aspect"
                                    v-model="edit_form.aspect"
                                    outlined
                                    item-text="name"
                                ></v-select>
                            </v-col>
                            <v-file-input
                                label="Dodaj sliku(primjer):"
                                filled
                                v-model="edit_form.example_image"
                                prepend-icon="mdi-camera"
                            ></v-file-input>
                            <v-file-input
                                label="Dodaj pozadinu(default):"
                                filled
                                v-model="edit_form.default_background"
                                prepend-icon="mdi-camera"
                            ></v-file-input>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            id="login-button"
                            class="mr-4"
                            type="submit"
                            @click="dialog3=false"
                            >
                            Potvrdi
                            </v-btn>
                            <v-btn
                            id="login-button"
                            class="mr-4"
                            @click="dialog3=false"
                            >
                            Odustani
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
                <v-dialog
                transition="dialog-top-transition"
                max-width="300"
                overlay-opacity="0.8"
                v-model="dialog2"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-icon color="red"
                    v-bind="attrs"
                    v-on="on"
                    v-if="superadmin"
                    class="card-icon">
                        {{ icons.mdiDelete }}
                    </v-icon>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-text id="confirm_dialog_text">Da li ste sigurni?</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            id="login-button"
                            class="mr-4"
                            @click="delete_template(template.id)"
                            >
                            Potvrdi
                            </v-btn>
                            <v-btn
                            id="login-button"
                            class="mr-4"
                            @click="dialog2=false"
                            >
                            Odustani
                            </v-btn>
                            </v-card-actions>
                    </v-card>
                </v-dialog>
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
        icons: {
            mdiPencil,
            mdiDelete
        },
        selected_templates: null,
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
        dialog2: false,
        dialog3: false,
    }),
    computed: {
        ...mapGetters({
            my_templates: 'templates/myTemplates',
            other_templates: 'templates/otherTemplates',
            current_template: 'templates/currentTemplate',
            failedLogin: 'errors/errors',
            admin: 'currentUser/admin',
            superadmin: 'currentUser/superadmin',
            aspects: 'superadmin/aspects',
            users_list: 'currentUser/usersList',
        }),
    },
    methods: {
        select_my_templates(){
            return this.selected_templates=this.my_templates;
        },
        select_other_templates(){
            return this.selected_templates=this.other_templates;
        },
        add_template(){
            this.$store.dispatch('templates/addTemplate', this.template_form);
            this.$refs.form.reset()
        },
        select_current_template(template){
            this.$store.dispatch('templates/currentTemplate', template);
        },
        edit_template(id){
            this.edit_form.id=id;
            this.$store.dispatch('templates/editTemplate', this.edit_form);
            this.$refs.form[0].reset()
        },
        delete_template(template){
            this.$store.dispatch('templates/deleteTemplate', template);
            return this.dialog2=false;
        },
    },
    mounted(){
       return this.selected_templates=this.my_templates
    }
}

</script>

