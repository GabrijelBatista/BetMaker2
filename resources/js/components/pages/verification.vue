<template>
    <v-card fluid class="fill-height" id="main_content">
        <v-card id="login_form">
            <v-card-title class="card_title justify-center">
                Verifikacija
            </v-card-title>
            <v-form @submit.prevent="verification">
                <v-text-field
                    class="login_text_field"
                    label="Verifikacijski kod:"
                    dark
                    required
                    single-line
                    :prepend-inner-icon="icons.mdiSecurity"
                    v-model="form.code"
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
        }
    }),

    methods: {
        verification(){
            this.form.email=this.verificationEmail;
            this.$store.dispatch('currentUser/verification', this.form)
        }
    },
    computed: {
        ...mapGetters({
            verificationEmail: 'currentUser/verificationEmail',
        }),
    },
}

</script>
