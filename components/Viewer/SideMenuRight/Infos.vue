<template>
  <v-data-table
    :headers="headers"
    :items="ebenen"
    :hide-default-header="true"
    :hide-default-footer="true"
    item-key="name"
    sort-by="name"
    group-by="ebene"
    class="elevation-1"
    show-group-by
    disable-pagination
  ></v-data-table>
</template>

<script lang="ts">
import { viewerStore } from '@/store'
import { DysplaySynNodeInfo } from '../../../models/SysNodeInfo'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
          groupable: false,
        },
        { text: 'Ebene', value: 'ebene' },
        { text: 'Value', value: 'value', groupable: false },
      ],
      ebenen: [] as DysplaySynNodeInfo[],
    }
  },
  computed: {
    infos(): DysplaySynNodeInfo[] {
      return viewerStore.ebeneInfos
    },
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infos(newValue: DysplaySynNodeInfo[], oldValue: DysplaySynNodeInfo[]) {
      this.setEbenen(newValue)
    },
  },
  methods: {
    setEbenen(list: DysplaySynNodeInfo[]) {
      const temp = []
      for (const index in list) {
        const item = list[index]
        temp.push(item)
      }
      this.ebenen = temp
    },
  },
}
</script>

<style scoped></style>
