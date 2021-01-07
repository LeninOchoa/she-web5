<template>
  <div>
    <v-app-bar
      dense
      app
      clipped-left
      clipped-right
      dark
      color="#00469B"
      fixed
      flat
    >
      <v-app-bar-nav-icon
        v-if="isAutheticated"
        class="navigation-drawer"
        @click="onToggle"
      ></v-app-bar-nav-icon>
      <v-toolbar-title v-if="isAutheticated" style="cursor: pointer">
        <v-btn text to="/" nuxt> SHE </v-btn></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="isAutheticated" class="navigation-items">
        <v-btn
          v-for="(modul, index) in modules"
          :key="index"
          text
          :to="modul.link"
          nuxt
        >
          {{ modul.Name }}
        </v-btn>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="onLogout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
          <span>Abmelden</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { sheStore, authStore } from '@/store'
import SyniosModules from '../../models/SyniosModules'
export default {
  name: 'TheHeader',
  computed: {
    isfrau(): boolean {
      return sheStore.isFrau
    },
    isAutheticated(): boolean {
      return authStore.isAutheticated
    },
    modules(): SyniosModules[] {
      return authStore.synModules
    },
    show(): boolean {
      return sheStore.showDrawer
    },
  },
  methods: {
    onLogout(): void {
      authStore.logout()
      this.$router.push('/signin')
    },
    onToggle(): void {
      sheStore.showMainDrawer(!this.show)
    },
  },
}
</script>

<style scoped>
.navigation-drawer {
  display: block;
}

@media (min-width: 768px) {
  .navigation-drawer {
    display: none;
  }
}

.navigation-items {
  display: none;
}

@media (min-width: 768px) {
  .navigation-items {
    display: block;
  }
}
</style>
