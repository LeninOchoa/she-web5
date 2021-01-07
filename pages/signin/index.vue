<template>
  <v-container>
    <v-row class="justify-center align-center">
      <v-col cols="12" sm="8" lass="justify-center align-center">
        <v-card outlined elevation="2">
          <v-card-title class="mt-1">
            <v-row align="center" class="spacer" no-gutters>
              <v-col cols="4" sm="2" md="1">
                <v-avatar size="56">
                  <img
                    alt="user"
                    src="~/assets/SHE-CORE-Alpha.png"
                    style="background-color: #4a5f9f"
                  />
                </v-avatar>
              </v-col>
              <v-col>
                <h2 class="font-weight-bold ml-3 mt-5 pb-4">Anmeldung</h2>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="validate"
            >
              <v-text-field
                v-model="user.login"
                label="Benutzername"
                prepend-icon="mdi-account-circle"
                :rules="[(v) => !!v || 'Benutzername eingeben']"
                required
              />
              <v-text-field
                v-model="user.password"
                :type="showPassword ? 'text' : 'password'"
                label="Passwort"
                :rules="[(v) => !!v || 'Password eingeben']"
                required
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @keydown.enter="validate"
                @click:append="showPassword = !showPassword"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              style="background-color: #4a5f9f"
              class="white--text"
              :disabled="!valid"
              primary
              large
              block
              @click="validate"
              >Anmelden
              <v-icon style="margin-top: -1px" class="ml-3"
                >mdi mdi-keyboard-return</v-icon
              ></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Login from '@/models/Login'
import { authStore } from '@/store'
import SheError from '@/models/SheError'
export default {
  layout: 'signin',
  data() {
    return {
      valid: true,
      showPassword: false,
      user: {
        login: 'test',
        password: '123456',
      },
    }
  },
  methods: {
    async validate() {
      if (this.$refs.form.validate() === false) {
        return
      }
      await authStore
        .authenticateUser(this.user as Login)
        .then(() => {
          this.$router.push('/')
        })
        .catch(() => {
          const err: SheError = {
            reload: true,
            statusCode: 408,
            message: '408 Login nicht möglich',
          }
          this.$nuxt.error(err)
        })
    },
  },
}
</script>
