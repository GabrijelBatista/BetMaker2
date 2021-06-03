<template>
<v-card fluid class="fill-height" id="main_content">
<v-card id="login_form">
        <v-card-title class="card_title justify-center">
          PRIJAVA
        </v-card-title>
  <v-form @submit.prevent="login">
    <v-text-field
    class="login_text_field"
      label="Email"
      dark
      required
      single-line
       :prepend-inner-icon="icons.mdiEmailOutline"
      v-model="form.email"
    ></v-text-field>
    <v-text-field
    class="login_text_field"
      label="Lozinka"
      required
      single-line
       :prepend-inner-icon="icons.mdiLockOutline"
      dark
      :type="'password'"
      v-model="form.password"
      autocomplete="off"
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
    mdiLockOutline
  } from '@mdi/js'
export default{
    data: () => ({
        icons: {
            mdiEmailOutline,
            mdiLockOutline
        },
        form: {
            email: "",
            password: ""
        }
    }),

    methods: {
    login(){
        this.$store.dispatch('currentUser/loginUser', this.form)
        }
    },
    computed: {
        ...mapGetters({
            failedLogin: 'errors/errors',
        }),
    }
}

</script>

