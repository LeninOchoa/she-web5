<template>
  <v-footer
    app
    dark
    color="#00469B"
    class="navigation-items"
    fixed
    outlined
    padless
  >
    <v-row>
      <v-col>
        <span>&copy; {{ new Date().getFullYear() }}</span>
        <span class="ml-4">Synios Document & Workflow Management GmbH</span>
      </v-col>
      <v-col v-show="show" class="text-right">
        <span class="text-right pr-2">
          <vac ref="vac" :left-time="lefttime" @finish="final">
            <span slot="process" slot-scope="{ timeObj }">
              {{ `Sitzung endet in: ${timeObj.m}:${timeObj.s}` }}
            </span>
            <span slot="finish"></span>
          </vac>
        </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import { sheStore, authStore } from '@/store'

export default {
  computed: {
    lefttime(): number {
      return sheStore.leftTimeSessionCounter
    },
    show(): boolean {
      const s = sheStore.showSessionCounter
      if (s === false) {
        this.stopTimer()
      } else {
        this.starTimer()
      }
      return s
    },
  },
  methods: {
    stopTimer() {
      if (this.$refs.vac === undefined) return
      this.$refs.vac.stopCountdown()
    },
    starTimer() {
      if (this.$refs.vac === undefined) return
      this.$refs.vac.startCountdown()
    },
    async final(): Promise<void> {
      console.log('TheFooter/final', this.lefttime)
      await authStore.logout().then(() => {
        this.$router.push('/signin')
      })
    },
  },
}
</script>

<style scoped>
.navigation-items {
  display: none;
}

@media (min-width: 768px) {
  .navigation-items {
    display: block;
  }
}
</style>
