<template>
  <v-container fluid>
    <v-row>
      <div class="parent">
        <v-hover
          v-for="card in cards"
          v-slot="{ hover }"
          :key="card.index"
          class="hoverCursor"
          open-delay="50"
        >
          <v-card
            :elevation="hover ? 16 : 2"
            :class="{ 'on-hover': hover }"
            class="ma-5"
          >
            <v-img
              :src="card.src"
              max-height="150"
              max-width="150"
              min-height="150"
              min-width="150"
            >
            </v-img>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    @click="removeDocument(card)"
                    v-on="on"
                  >
                    <v-icon>mdi-bookmark-remove</v-icon>
                  </v-btn>
                </template>
                <span>Dokument entfernen</span>
              </v-tooltip>

              <v-spacer></v-spacer>

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" @click="checkMark(card)" v-on="on">
                    <v-icon v-if="card.marked">mdi-checkbox-marked</v-icon>
                    <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
                  </v-btn>
                </template>
                <span>Dokument merken</span>
              </v-tooltip>

              <v-btn icon @click="printer(card)">
                <v-icon>mdi-printer</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </div>
    </v-row>
    <v-row wrap no-gutters>
      <div
        id="viewer-image"
        ref="image"
        style="width: 100%; height: 65vh; position: relative"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import OpenSeadragon from 'openseadragon'
import { viewerStore } from '@/store'
import { PrintImages } from '@/services/she/Print'
import { SynImage } from '../../models/SynImages'
export default {
  name: 'MerkenViewer',
  data() {
    return {
      viewer: null,
      ima: null,
      images: [],
      cards: [] as SynImage[],
    }
  },
  computed: {
    storeImages(): SynImage[] {
      return viewerStore.noticedPictures
    },
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    storeImages(newCount: SynImage[], oldCount: SynImage[]) {
      this.cards = newCount
    },
  },
  mounted() {
    if (this.viewer === null) this.initViewer()
    this.$root.$on('clearViewer', () => {
      this.clearViewer()
    })
  },
  methods: {
    initViewer(): void {
      if (this.viewer !== null) return
      this.viewer = OpenSeadragon({
        id: 'viewer-image',
        animationTime: 0.4,
        prefixUrl: '/assets/images/',
        // showNavigator: true,
        sequenceMode: true,
        // showReferenceStrip: true,
        // referenceStripScroll: 'vertical',
        showRotationControl: true,
        preserveViewport: true,
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'home',
        fullPageButton: 'full-page',
        rotateLeftButton: 'rotate-left',
        rotateRightButton: 'rotate-right',
        tileSources: this.files,
        // Enable touch rotation on tactile devices
        gestureSettingsTouch: {
          pinchRotate: true,
        },
      })
    },
    clearViewer() {
      this.images = []
      this.viewer.world.resetItems()
      this.viewer.tileSources = []
      this.viewer.open(this.images)
    },
    checkMark(param: SynImage) {
      console.log(param)
    },
    removeDocument(card: SynImage) {
      viewerStore.removeNoticedPictures(card)
    },
    printer(param) {
      PrintImages(param.src)
    },
  },
}
</script>

<style scoped>
.parent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: white;
  overflow-x: auto;
}
.hoverCursor:hover {
  cursor: pointer;
}
</style>
