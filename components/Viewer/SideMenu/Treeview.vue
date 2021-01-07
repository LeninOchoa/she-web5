<template>
  <v-treeview
    ref="tree"
    :active.sync="active"
    :items="items"
    :load-children="fetchNodes"
    :open.sync="open"
    activatable
    dense
    item-key="id"
    open-on-click
    transition
  >
    <template slot="label" slot-scope="{ item }">
      <div @click="onClick(item)">
        <v-icon class="mr-2"> {{ files[item.ico] }} </v-icon>{{ item.name }}
        <v-menu bottom left transition="slide-y-transition" tile>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item-group color="primary">
              <v-list-item v-for="(it, i) in menus" :key="i">
                <v-list-item-icon>
                  <v-icon>mdi-arrow-expand-all</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title @click="onClickMenu(item)">{{
                    it.title
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-treeview>
</template>

<script lang="ts">
import { viewerStore, authStore } from '@/store'
import { SearchParameterBaum } from '@/models/SearchParameter'
import SynNode from '@/models/SynNode'
import { searchRootNodes } from '~/services/viewer/ViewerService'
export default {
  data: () => ({
    files: {
      pat: 'mdi mdi-account',
      auf: 'mdi-seat-flat',
      allg: 'mdi-account-star',
      bel: 'mdi-file-multiple',
      rest: 'mdi-folder',
    },
    expand: false as boolean,
    active: [],
    open: [],
    items: [] as SynNode[],
    menus: [{ title: 'Ein/Aus -klappen' }],
  }),
  computed: {
    searchParamter(): SearchParameterBaum {
      return viewerStore.searchParameter
    },
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchParamter(newValue, oldValue) {
      this.rootNodes(newValue)
    },
  },
  methods: {
    fetchNodes(item) {
      console.log('Treeview/fetchNodes', item)
    },

    async rootNodes(param) {
      viewerStore.loadEbeneInfos([])
      viewerStore.loadInViewer([])
      const token = authStore.token
      await searchRootNodes(param, token).then((res) => {
        if (res.length > 0) this.activeTab = 1
        this.items = []
        setTimeout(() => {
          this.items = res
        }, 500)
      })
    },
    onClick(item) {
      console.log('Treeview/onClick', item)
    },
    onClickMenu(item) {
      if (!this.open.includes(item.id)) {
        this.open = [...this.open, item.id]
        this.expand = true
      } else {
        this.open = this.open.filter((nodeId) => nodeId !== item.id)
        this.expand = false
      }
    },
  },
}
</script>

<style scoped></style>
