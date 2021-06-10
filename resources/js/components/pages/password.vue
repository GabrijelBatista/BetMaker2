<template>
    <v-card fluid class="fill-height" id="main_content">
        <v-card id="login_form">
            <v-card-title class="card_title justify-center">
                Promjena lozinke
            </v-card-title>
            <v-form @submit.prevent="change_password">
                <v-text-field
                    label="Verifikacijski kod:"
                    dark
                    required
                    single-line
                    :prepend-inner-icon="icons.mdiSecurity"
                    v-model="form.code"
                ></v-text-field>
                <v-text-field
                    label="Lozinka"
                    required
                    v-model="form.password"
                    dark
                    :type="'password'"
                    :prepend-inner-icon="icons.mdiLockOutline"
                    autocomplete="new-password"
                ></v-text-field>
                <v-text-field
                    label="Potvrda lozinke"
                    dark
                    required
                    v-model="form.password_confirmation"
                    :type="'password'"
                    :prepend-inner-icon="icons.mdiLockAlertOutline"
                ></v-text-field>
                <v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="mr-4"
                        type="submit"
                    >
                        POTVRDI
                    </v-btn>
                </v-card-title>
            </v-form>
        </v-card>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    mdiSecurity,
} from '@mdi/js'
export default{
    data: () => ({
        icons: {
            mdiSecurity,
        },
        form: {
            code: "",
            email: null,
            password: null,
            password_confirmation: null
        }
    }),

    methods: {
        change_password(){
            this.form.email=this.verificationEmail;
            this.$store.dispatch('currentUser/change_password', this.form)
        }
    },
    computed: {
        ...mapGetters({
            verificationEmail: 'currentUser/verificationEmail',
        }),
    },
}

</script>
