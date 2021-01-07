<template>
  <v-app dark>
    <div class="center">
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <v-btn v-if="reload" outlined color="indigo" block href="/">
        Reload
      </v-btn>
      <v-btn v-else outlined color="indigo" block to="/"> Reload </v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { PropOptions } from 'vue'
import SheError from '@/models/SheError'
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      required: true,
    } as PropOptions<SheError>,
  },
  data() {
    return {
      pageNotFound: '404 nicht gefunden',
      otherError: 'Es ist ein Fehler aufgetreten',
      reload: false,
    }
  },
  head() {
    if (this.error.reload !== undefined) {
      this.reload = this.error.reload
    }
    this.otherError =
      this.error.message === undefined ? this.otherError : this.error.message
    const title = 'SHE-Error'
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
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
