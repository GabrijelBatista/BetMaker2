<template>
<v-card fluid class="fill-height" id="main_content">
<v-card id="login_form">
        <v-card-title class="card_title justify-center">
          REGISTRACIJA
        </v-card-title>
  <v-form @submit.prevent="register">
    <v-text-field
      label="E-mail"
      v-model="form.email"
      dark
      :prepend-inner-icon="icons.mdiEmailOutline"
      required
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
      autocomplete="new-password"
    ></v-text-field>
    <v-card-title>
        <v-spacer></v-spacer>
    <v-btn
      id="login-button"
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
    mdiEmailOutline,
    mdiLockOutline,
    mdiLockAlertOutline
  } from '@mdi/js'

export default{
    data: () => ({
        icons: {
            mdiEmailOutline,
            mdiLockOutline,
            mdiLockAlertOutline
        },
        form: {
            email: "",
            password: "",
            password_confirmation: "",
        },
        errors: {}
    }),

    methods: {
        register(){
            this.$store.dispatch('currentUser/registerUser', this.form)
        }
    },
    computed: {
        ...mapGetters({
            failedLogin: 'errors/errors',
        }),
    }
}

</script>

