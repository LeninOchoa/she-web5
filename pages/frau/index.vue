<template>
  <div class="center">
    <v-progress-circular
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script lang="ts">
import { sheStore, authStore } from '@/store'
import SheError from '@/models/SheError'
import Login from '@/models/Login'
import FrauParameter from '@/models/FrauParameter'
export default {
  layout: 'frau',
  data() {
    return {
      frau: {
        user: null,
        password: null,
        patientId: null,
        fallnummer: null,
        documentId: null,
        baumsf: null,
        module: null,
      } as FrauParameter,
    }
  },
  mounted() {
    this.frau.password = this.$route.query.password
    this.frau.user = this.$route.query.username
    this.frau.patientId = this.$route.query.PatientId
    this.frau.fallnummer = this.$route.query.Fallnummer
    this.frau.documentId = this.$route.query.DocumentId
    this.frau.baumsf = this.$route.query.baumsf
    this.frau.module =
      this.$route.query.module === undefined
        ? '/viewer'
        : this.$route.query.module
    this.validate()
  },
  methods: {
    validate() {
      if (this.frau.user === undefined || this.frau.password === undefined) {
        const err: SheError = {
          reload: true,
          statusCode: 930,
          message: 'Logindaten sind nicht vorhanden',
        }
        this.$nuxt.error(err)
      }

      const user: Login = {
        login: this.frau.user,
        password: this.frau.password,
      }
      authStore
        .authenticateUser(user)
        .then(() => {
          sheStore.setFrauParameter(this.frau)
          this.$router.push('/viewer')
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

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
