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

<script>
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
      ebenen: [],
    }
  },
  computed: {
    infos() {
      return this.$store.state.viewer.ebeneInfos
    },
  },
  watch: {
    infos(newValue, oldValue) {
      this.setEbenen(newValue)
    },
  },
  methods: {
    setEbenen(list) {
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
