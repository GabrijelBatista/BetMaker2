<template>
    <v-card>
        <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="role_dialog"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                    >Dodaj role</v-btn>
                    </template>
                    <v-card class="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Dodaj role
                        </v-card-title>
                        <v-form @submit.prevent="add_role" ref="form">
                            <v-text-field
                            label="Naziv"
                            required
                            v-model="role_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            class="login-button"
                            type="submit"
                            @click="role_dialog = false"
                            >
                            POTVRDI
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>


                <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="aspect_dialog"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                    >Dodaj aspect</v-btn>
                    </template>
                    <v-card class="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Dodaj aspect
                        </v-card-title>
                        <v-form @submit.prevent="add_aspect" ref="form">
                            <v-text-field
                            label="Naziv"
                            required
                            v-model="aspect_form.name"
                            autocomplete="off"
                            ></v-text-field>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            class="login-button"
                            type="submit"
                            @click="aspect_dialog = false"
                            >
                            POTVRDI
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>


                 <v-dialog
                transition="dialog-top-transition"
                max-width="600"
                overlay-opacity="0.8"
                v-model="resolution_dialog"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                    >Dodaj rezoluciju</v-btn>
                    </template>
                    <v-card id="dialog_box">
                        <v-card-title class="headline grey lighten-2">
                            Dodaj rezoluciju
                        </v-card-title>
                        <v-form @submit.prevent="add_resolution" ref="form">
                            <v-text-field
                            label="Širina"
                            required
                            v-model="resolution_form.width"
                            autocomplete="off"
                            ></v-text-field>
                            <v-text-field
                            label="Visina"
                            required
                            v-model="resolution_form.height"
                            autocomplete="off"
                            ></v-text-field>
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    :items="aspects"
                                    label="* Choose aspect"
                                    v-model="resolution_form.aspect"
                                    outlined
                                    item-text="name"
                                    ></v-select>
                                </v-col>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn
                            id="login-button"
                            type="submit"
                            @click="aspect_dialog = false"
                            >
                            POTVRDI
                            </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default{
    data: () => ({
        role_form: {
            name: "",
        },
        aspect_form: {
            name: "",
        },
        resolution_form: {
            width: "",
            height: "",
            aspect: "",
        },
        role_dialog: false,
        aspect_dialog: false,
        resolution_dialog: false,
    }),
    computed: {
        ...mapGetters({
            failedLogin: 'errors/errors',
            aspects: 'superadmin/aspects',
        }),
    },
    methods: {
        add_role(){
            this.$store.dispatch('superadmin/addRole', this.role_form);
            this.$refs.form.reset()
        },
        add_aspect(){
            this.$store.dispatch('superadmin/addAspect', this.aspect_form);
            this.$refs.form.reset()
        },
        add_resolution(){
            this.$store.dispatch('superadmin/addResolution', this.resolution_form);
            this.$refs.form.reset()
        },
    },

    created(){
        this.$store.dispatch('superadmin/getSuperadminResources');
    },
}

</script>

