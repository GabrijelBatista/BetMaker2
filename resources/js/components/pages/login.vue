<template>
<v-card fluid class="fill-height" id="main_content">
    <v-slide-x-transition mode="out-in">
        <v-btn class="verification_button" transition="fade-transition" @click="send_verification_code" v-if="verified===false">Pošalji verifikacijski kod</v-btn>
    </v-slide-x-transition>
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
    ></v-text-field>
      <a href="#" @click="send_verification_code_for_password_reset" class="forget_password">Zaboravili ste lozinku?</a>
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
            password: "",
        }
    }),

    methods: {
      send_verification_code_for_password_reset(){
        this.$store.dispatch('currentUser/sendVerificationCodeForPasswordReset', this.form.email)
      },
      login(){
        this.$store.dispatch('currentUser/loginUser', this.form)
      }
    },
    computed: {
        ...mapGetters({
            failedLogin: 'errors/errors',
            getVerified: 'currentUser/verified',
        }),
         verified: {
            get() {
                return this.getVerified;
            },
            set(getVerified) {
                return this.getVerified;
            }
        }
    },
}

</script>

