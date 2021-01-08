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
import {
  SearchChildren,
  SearchParameterBaum,
  Parent,
  LoadedImages,
} from '@/models/SearchParameter'
import SynNode from '@/models/SynNode'
import { DysplaySynNodeInfo, SynNodeInfo } from '@/models/SysNodeInfo'
import {
  searchRootNodes,
  loadChildren,
  GetInformation,
} from '~/services/viewer/ViewerService'
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
    async fetchNodes(item: SynNode) {
      const parent: Parent = {
        EbeneID: item.data.EbeneID,
        PKID: item.data.PKID,
        sPKID: item.data.sPKID,
        BelegTypID: item.data.BelegTypID,
        parent: Object.assign({}, item),
      }

      const param: SearchChildren = {
        treeId: viewerStore.searchParameter.treeId,
        ParentNode: parent,
        Sfs: JSON.parse(
          JSON.stringify(viewerStore.searchParameter.SearchParameter)
        ),
      }
      const token = authStore.syniosToken
      await loadChildren(param, token).then((res) => {
        if (res.nodes.length !== 0) {
          item.children = res.nodes

          if (this.expand) {
            for (const index in res.nodes) {
              const node = res.nodes[index]
              this.fetchNodes(node)
              if (this.open.includes(item.id) === false) {
                this.open = [...this.open, item.id]
              }
            }
          }
        } else {
          item.children = []
        }

        if (res.images.files.length > 0) {
          item.files = res.images.files
          item.imageUrls = res.images.images
          if (this.expand === false) {
            viewerStore.loadInViewer(res.images)
          }
        }
      })
    },

    async rootNodes(param: SearchParameterBaum) {
      viewerStore.loadEbeneInfos([])
      viewerStore.loadInViewer(null)
      const token = authStore.syniosToken
      await searchRootNodes(param, token).then((res) => {
        if (res.length > 0) this.activeTab = 1
        this.items = []
        setTimeout(() => {
          this.items = res
        }, 500)
      })
    },

    async onClick(item: SynNode) {
      this.expand = false
      if (item.imageUrls.length > 0) {
        const img: LoadedImages = { files: item.files, images: item.imageUrls }
        viewerStore.loadInViewer(img)
      }

      if (item.Information !== null) {
        viewerStore.loadEbeneInfos(item.Information)
        return
      }

      const EbeneIds: number[] = []
      const Pkids: Array<number[]> = []

      let node = item
      while (node != null) {
        if (EbeneIds.includes(node.data.EbeneID) === false) {
          EbeneIds.push(node.data.EbeneID)
        }

        const arr: number[] = []
        for (const index in node.data.PKID) {
          if (arr.includes(node.data.PKID[index]) === false) {
            arr.push(node.data.PKID[index])
          }
        }
        Pkids.push(arr)
        node = node.parent
      }
      const rest: SynNodeInfo[] = await GetInformation(
        EbeneIds,
        Pkids,
        authStore.syniosToken
      )
      const infos: DysplaySynNodeInfo[] = []
      const keys = Object.keys(rest)
      for (const index in keys) {
        const obj = rest[index]
        if (obj === null || obj.InfoEbeneSpalten == null) continue
        for (const index2 in obj.InfoEbeneSpalten) {
          const info = obj.InfoEbeneSpalten[index2]
          const temp: DysplaySynNodeInfo = {
            ebene: obj.Bezeichnung,
            name: info.Name,
            value: info.ColumnValue,
          }
          infos.push(temp)
        }
      }

      item.Information = Object.assign({}, infos)
      viewerStore.loadEbeneInfos(item.Information)
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
