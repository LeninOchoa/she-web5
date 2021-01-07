<template>
  <v-navigation-drawer v-model="drawer" absolute temporary>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>SHE</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        v-for="(modul, index) in modules"
        :key="index"
        link
        nuxt
        :to="modul.link"
      >
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ modul.Name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link nuxt>
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title @click="onLogout">Abmelden</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { sheStore, authStore } from '@/store'
import SyniosModules from '@/models/SyniosModules'
export default {
  computed: {
    show(): boolean {
      return sheStore.showDrawer
    },
    modules(): SyniosModules[] {
      return authStore.synModules
    },
    drawer: {
      get(): boolean {
        return this.show
      },
      set(newValue: boolean) {
        if (newValue === false) sheStore.showMainDrawer(false)
      },
    },
  },
  methods: {
    onLogout(): void {
      sheStore.showMainDrawer(false)
      authStore.logout()
      this.$router.push('/signin')
    },
  },
}
</script>
