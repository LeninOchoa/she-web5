<template>
  <v-container fluid>
    <v-row wrap no-gutters>
      <div
        id="viewer-image"
        ref="image"
        style="width: 100%; height: 65vh; position: relative"
      />
    </v-row>
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
              @click="activateCard(card)"
            >
            </v-img>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    @click="addToMaredkList(card)"
                    v-on="on"
                  >
                    <v-icon>mdi-bookmark-outline</v-icon>
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
  </v-container>
</template>

<script lang="ts">
import OpenSeadragon from 'openseadragon'
import { v4 as uuidv4 } from 'uuid'
import { viewerStore } from '@/store'
import { PrintImages } from '@/services/she/Print'
import { LoadedImages } from '@/models/SearchParameter'
import { SynImage } from '../../models/SynImages'
// window.OpenSeadragon = OpenSeadragon

export default {
  name: 'MainViewer',
  data() {
    return {
      tab: null,
      viewer: null,
      ima: null,
      images: [],
      loadedImages: { files: [], images: [] } as LoadedImages,
      cards: [] as SynImage[],
    }
  },
  computed: {
    drawerLeft(): boolean {
      return viewerStore.drawerL
    },
    storeImages(): LoadedImages {
      return viewerStore.images
    },
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    storeImages(newCount: LoadedImages, oldCount: LoadedImages) {
      this.loadedImages = newCount
      this.ShowPictures()
    },
  },
  mounted() {
    if (this.viewer === null) this.initViewer()
    this.$root.$on('clearViewer', () => {
      this.clearViewer()
    })
  },
  methods: {
    ShowPictures() {
      if (this.loadedImages === null) return
      if (this.loadedImages.images === null) return
      if (this.loadedImages.images.length === 0) return

      const imgs: SynImage[] = []
      const keys = Object.keys(this.loadedImages.images)
      for (const index in keys) {
        const item = this.loadedImages.images[index]
        const img: SynImage = {
          index: parseInt(index),
          id: uuidv4(),
          src: item,
          marked: false,
        }
        imgs.push(img)
      }
      this.cards = imgs
      if (imgs.length > 0) {
        this.activateCard(imgs[0])
      }
    },
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
    activateCard(param: SynImage) {
      this.clearViewer()
      this.images.push({
        type: 'image',
        url: param.src,
      })
      this.viewer.open(this.images)
    },
    addToMaredkList(param: SynImage) {
      viewerStore.setNoticedPictures(param)
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
