<template>
  <v-card>
    <v-navigation-drawer
      v-if="!$vuetify.breakpoint.xsOnly"
      ref="drawer"
      app
      clipped
      permanent
      :mini-variant.sync="mini"
      right
      bottom
      width="30%"
    >
      <v-row class="fill-height" no-gutters>
        <v-col md="auto" :cols="colLeft">
          <v-navigation-drawer mini-variant mini-variant-width="60" permanent>
            <v-list-item class="px-2">
              <v-btn v-if="!mini" icon @click="onClickMini">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <v-btn v-else icon @click="onClickMini">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
              <v-list-item v-for="item in items" :key="item.title">
                <v-btn icon @click="tabsEvent(item)">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-col v-show="!mini" :cols="colRight">
          <Infos v-show="info"></Infos>
          <Archiv v-show="!info"></Archiv>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import Infos from '~/components/Viewer/SideMenuRight/Infos'
import Archiv from '~/components/Viewer/SideMenuRight/Archiv'
export default {
  components: {
    Infos,
    Archiv,
  },
  data: () => ({
    items: [
      { title: 'Information', icon: 'mdi-information-outline' },
      { title: 'Archiv', icon: 'mdi-archive' },
    ],
    colLeft: 11,
    colRight: 0,
    mini: true,
    info: true,
    navigation: {
      width: 365,
      borderSize: 1,
    },
  }),
  mounted() {
    this.setBorderWidth()
    this.setEvents()
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
        (e) => {
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
    tabsEvent(item) {
      this.info = item.title === 'Information'
    },
    onClickMini() {
      this.mini = !this.mini
      if (this.min) {
        this.colRight = 1
        this.colLeft = 11
      } else {
        this.colLeft = 2
        this.colRight = 10
      }
    },
  },
}
</script>
