<template>
<v-card id="login_form">
        <v-card-title class="headline grey lighten-2">
          REGISTRACIJA
        </v-card-title>
  <v-form @submit.prevent="register">
    <v-text-field
      label="E-mail"
      v-model="form.email"
      required
    ></v-text-field>
    <v-text-field
      label="Lozinka"
      required
      v-model="form.password"
      :type="'password'"
      autocomplete="new-password"
    ></v-text-field>
    <v-text-field
      label="Potvrda lozinke"
      required
      v-model="form.password_confirmation"
      :type="'password'"
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
</template>

<script>
import { mapGetters } from 'vuex'

export default{
    data: () => ({
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

