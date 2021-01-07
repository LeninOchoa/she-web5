<template>
  <div>
    <!--The SideMenu Component go here-->
    <SideMenu></SideMenu>

    <v-toolbar color="primary" flat dense>
      <v-app-bar-nav-icon
        class="white--text"
        @click="drawerClick"
      ></v-app-bar-nav-icon>

      <v-tabs v-model="tab" align-with-title dark>
        <v-tabs-slider color="white"></v-tabs-slider>
        <v-tab key>Viewer</v-tab>
        <v-tab v-show="ShowViewer">gemerkte Bilder</v-tab>
      </v-tabs>

      <v-spacer></v-spacer>
      <v-btn v-show="tab === 0" id="zoom-out" icon dark>
        <v-icon>mdi-magnify-minus-outline</v-icon>
      </v-btn>

      <v-btn v-show="tab === 0" id="zoom-in" icon dark>
        <v-icon>mdi-magnify-plus-outline</v-icon>
      </v-btn>

      <v-btn v-show="tab === 0" id="home" icon dark>
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>

      <v-btn v-show="tab === 0" id="full-page" icon dark>
        <v-icon>mdi-fullscreen</v-icon>
      </v-btn>

      <v-btn v-show="tab === 0" id="rotate-left" icon dark>
        <v-icon>mdi-rotate-left</v-icon>
      </v-btn>

      <v-btn v-show="tab === 0" id="rotate-right" icon dark>
        <v-icon>mdi-rotate-right</v-icon>
      </v-btn>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item :eager="true"> </v-tab-item>
      <v-tab-item :eager="true">
        <v-container fluid> </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import SideMenu from '@/components/Viewer/SideMenu/SideMenu.vue'
import { viewerStore } from '@/store'
export default {
  components: {
    SideMenu,
  },
  data() {
    return {
      tab: null,
    }
  },
  computed: {
    drawerLeft(): boolean {
      return viewerStore.drawerL
    },
    ShowViewer(): boolean {
      return viewerStore.isExistedNoticedPictures
    },
  },
  methods: {
    drawerClick() {
      viewerStore.setDrawerL(!this.drawerLeft)
    },
  },
}
</script>
