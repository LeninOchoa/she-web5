<template>
  <div>
    <!--The SideMenu Component go here-->
    <SideMenu></SideMenu>
    <SideMenuRight></SideMenuRight>

    <v-toolbar color="primary" flat dense>
      <v-app-bar-nav-icon
        class="white--text"
        @click="drawerClick"
      ></v-app-bar-nav-icon>

      <v-tabs v-model="tab" align-with-title dark>
        <v-tabs-slider color="white"></v-tabs-slider>
        <v-tab key>Viewer</v-tab>
        <v-tab v-show="ShowViewer">
          <v-badge color="red" :content="storeImages"
            >gemerkte Bilder
          </v-badge></v-tab
        >
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
      <v-tab-item :eager="true">
        <MainViewer></MainViewer>
      </v-tab-item>
      <v-tab-item :eager="true">
        <v-container fluid>
          <MerkenViewer></MerkenViewer>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import MainViewer from '@/components/Viewer/MainViewer.vue'
import MerkenViewer from '@/components/Viewer/MerkenViewer.vue'
import { viewerStore } from '@/store'
import SideMenuRight from '~/components/Viewer/SideMenuRight/SideMenuRight'
import SideMenu from '~/components/Viewer/SideMenu/SideMenu.vue'
export default {
  components: {
    SideMenuRight,
    SideMenu,
    MerkenViewer,
    MainViewer,
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
    storeImages(): number {
      if (viewerStore.noticedPictures === null) return 0
      if (viewerStore.noticedPictures.length === 0) this.setTab(0)
      return viewerStore.noticedPictures.length
    },
  },
  methods: {
    setTab(index: number) {
      this.tab = index
    },
    drawerClick() {
      viewerStore.setDrawerL(!this.drawerLeft)
    },
  },
}
</script>
