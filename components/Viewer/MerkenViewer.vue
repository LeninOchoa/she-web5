<template>
  <v-container fluid>
    <v-row wrap no-gutters>
      <div
        id="viewer-bookmark"
        ref="image"
        style="width: 100%; height: 65vh; position: relative"
      />
    </v-row>
    <v-row>
      <v-slide-group
        v-model="model"
        class="parent"
        active-class="success"
        show-arrows
      >
        <v-slide-item v-for="(card, index) in cards" :key="card.id + index">
          <v-hover v-slot="{ hover }" class="hoverCursor" open-delay="50">
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
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="checkMark(card)"
                      v-on="on"
                    >
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
        </v-slide-item>
      </v-slide-group>
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
      model: null,
      viewerBookmark: null,
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
    if (this.viewerBookmark === null) this.initViewer()
  },
  methods: {
    initViewer(): void {
      if (this.viewerBookmark !== null) return
      this.viewerBookmark = OpenSeadragon({
        id: 'viewer-bookmark',
        animationTime: 0.4,
        prefixUrl: '/assets/images/',
        collectionMode: true,
        collectionColumns: 2,
        collectionLayout: 'vertical',
        tileSources: this.files,
      })
    },
    clearViewer() {
      this.viewerBookmark.world.resetItems()
      this.viewerBookmark.tileSources = []
      this.viewerBookmark.open(this.images)
    },
    checkMark(param: SynImage) {
      this.clearViewer()
      this.images.push({
        type: 'image',
        url: param.src,
        id: param.id,
      })
      this.viewerBookmark.open(this.images)
    },
    removeDocument(card: SynImage) {
      viewerStore.removeNoticedPictures(card)
      this.images = this.images.filter(function (item) {
        return item.id !== card.id
      })
      this.clearViewer()
      this.viewerBookmark.open(this.images)
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
