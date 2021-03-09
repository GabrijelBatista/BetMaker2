<template>
<v-card id="login_form">
        <v-card-title class="headline grey lighten-2">
          PRIJAVA
        </v-card-title>
  <v-form @submit.prevent="login">
    <v-text-field
      label="Email"
      required
      v-model="form.email"
    ></v-text-field>
    <v-text-field
      label="Lozinka"
      required
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
</template>

<script>
import { mapGetters } from 'vuex'
export default{
    data: () => ({
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

