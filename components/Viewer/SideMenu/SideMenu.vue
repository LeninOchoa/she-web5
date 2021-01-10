<template>
  <v-navigation-drawer
    ref="drawer"
    v-model="drawerIntern"
    app
    clipped
    bottom
    :width="navigation.width"
  >
    <v-toolbar color="primary" flat dense>
      <v-container fluid>
        <v-row align="center">
          <v-col align-self="center" class="mt-5">
            <v-select
              v-if="!isfrau"
              v-model="select"
              :items="items"
              label="Baum"
              item-text="Bezeichnung"
              item-value="BaumId"
              persistent-hint
              return-object
              single-line
              dark
              @change="selectTree"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar>
    <v-tabs v-model="activeTab" grow>
      <v-tab v-if="!isfrau">Suche </v-tab>
      <v-tab-item v-if="!isfrau" :eager="true">
        <Search @search="search"></Search>
      </v-tab-item>
      <v-tab> Baum </v-tab>
      <v-tab-item :eager="true">
        <Treeview></Treeview>
      </v-tab-item>
    </v-tabs>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { viewerStore, sheStore } from '@/store'
import FrauParameter from '@/models/FrauParameter'
import Search from '@/components/She/Search'
import BaumData from '@/models/BaumData'
import { SearchParameterBaum } from '@/models/SearchParameter'
import Treeview from '~/components/Viewer/SideMenu/Treeview'
export default {
  components: { Search, Treeview },
  data: () => ({
    activeTab: 0 as number,
    select: null as BaumData | null,
    navigation: {
      width: 365,
      borderSize: 2,
    },
    items: [] as BaumData[],
  }),
  computed: {
    frau(): FrauParameter {
      return sheStore.frauParameter
    },
    isfrau(): boolean {
      return sheStore.isFrau
    },
    drawerIntern: {
      // getter
      get() {
        return viewerStore.drawerL
      },
      // setter
      set(newValue) {
        viewerStore.setDrawerL(newValue)
      },
    },
  },
  mounted() {
    this.setBorderWidth()
    this.setEvents()
    if (this.isfrau === false) this.getTrees()
    else this.frauSearch()
  },
  methods: {
    setBorderWidth() {
      const i = this.$refs.drawer.$el.querySelector(
        '.v-navigation-drawer__border'
      )
      i.style.width = this.navigation.borderSize + 'px'
      i.style.cursor = 'ew-resize'
      i.style.backgroundColor = 'blue'
    },
    setEvents() {
      const minSize = this.navigation.borderSize
      const el = this.$refs.drawer.$el
      const drawerBorder = el.querySelector('.v-navigation-drawer__border')
      const direction = el.classList.contains('v-navigation-drawer--right')
        ? 'right'
        : 'left'

      function resize(e) {
        document.body.style.cursor = 'ew-resize'
        const f =
          direction === 'right'
            ? document.body.scrollWidth - e.clientX
            : e.clientX
        el.style.width = f + 'px'
      }

      drawerBorder.addEventListener(
        'mousedown',
        (e: any) => {
          if (e.offsetX < minSize) {
            el.style.transition = 'initial'
            document.addEventListener('mousemove', resize, false)
          }
        },
        false
      )

      document.addEventListener(
        'mouseup',
        () => {
          el.style.transition = ''
          this.navigation.width = el.style.width
          document.body.style.cursor = ''
          document.removeEventListener('mousemove', resize, false)
        },
        false
      )
    },
    async getTrees(): void {
      if (viewerStore.trees.length === 0) {
        await viewerStore.getTreeData().then(async (res) => {
          this.items = res
          if (res.length === 1) {
            this.select = this.items[0]
            await this.selectTree()
          }
        })
      } else {
        this.items = viewerStore.trees
        if (viewerStore.trees.length === 1) {
          this.select = this.items[0]
          await this.selectTree()
        }
      }
    },
    async selectTree(): void {
      const fields = viewerStore.searchFields.find(
        (f) => f.treeId === this.select.BaumId
      )
      if (fields === undefined) {
        await viewerStore.getTreeFields(this.select.BaumId)
      }
    },
    search(param: SearchParameterBaum) {
      param.treeId = this.select.BaumId
      this.$root.$emit('clearMainViewer')
      viewerStore.setSearchParameter(param)
      this.activeTab = 1
    },
    frauSearch() {
      /*
      const baumId =
        this.frau.baumsf === undefined ? process.env.baumsf : this.frau.baumsf

      let rest = await viewerStore.getTreeFields(baumId as number)
      rest = Object.assign({}, rest)
      for (const index in rest) {
        if (
          rest.data[index].AliasIntern === 'Aufenthaltsnummer' &&
          this.frau.fallnummer !== undefined
        ) {
          rest.data[index].SearchValue = this.frau.fallnummer
        } else if (
          rest.data[index].AliasIntern === 'Patientennummer' &&
          this.frau.patientId !== undefined
        ) {
          rest.data[index].SearchValue = this.frau.patientId
        }
      }
      rest.treeId = baumId
      this.setSearchParameter(rest)
       */
    },
  },
}
</script>
