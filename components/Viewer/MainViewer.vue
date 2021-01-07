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
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import OpenSeadragon from 'openseadragon'
import { v4 as uuidv4 } from 'uuid'
import { PrintImages } from '~/modules/she/Print'
window.OpenSeadragon = OpenSeadragon

export default {
  name: 'MainViewer',
  data() {
    return {
      tab: null,
      viewer: null,
      contentBuffer: [],
      ima: null,
      images: [],
      imageUrls: {},
      cards: [],
    }
  },
  computed: {
    ...mapState({
      drawerLeft: (state) => state.viewer.drawerL,
      storeImages: (state) => state.viewer.images,
    }),
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    storeImages(newCount, oldCount) {
      this.imageUrls = newCount
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
    ...mapMutations({
      setDrawerL: 'viewer/setDrawerL',
      setNoticedPictures: 'viewer/setNoticedPictures',
      deleteNoticedPictures: 'viewer/deleteNoticedPictures',
    }),
    ShowPictures() {
      // this.clearViewer()
      const imgs = []
      for (let index = 0; index < this.imageUrls.length; ++index) {
        const item = this.imageUrls[index]
        imgs.push({
          index,
          id: uuidv4(),
          src: item,
          marked: false,
        })
      }
      if (imgs.length > 0) {
        this.activateCard(imgs[0])
      }
      this.cards = imgs
    },
    initViewer() {
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
    activateCard(param) {
      this.clearViewer()
      this.images.push({
        type: 'image',
        url: param.src,
      })
      this.viewer.open(this.images)
    },
    checkMark(param) {
      console.log('checkMark', param)
      this.setNoticedPictures({ id: param.id, src: param.src })

      const index = this.cards.findIndex((c) => c.id === param.id)
      if (index === -1) return
      this.cards[index].marked = !param.marked
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
