import { ActionTree, GetterTree, MutationTree } from 'vuex'
import Searchfield from '@/models/Searchfield'
import { $axios } from '~/utils/axios'

export const state = () => ({
  trees: [] as Array<object>,
  searchFields: [] as Searchfield[],
  selectedSearchFields: [],
  searchParameter: [],
  images: [],
  searchedTree: [],
  ebeneInfos: [],
  drawerL: true,
  noticedPictures: [] as any[],
})

export type AnotherModuleState = ReturnType<typeof state>

export const getters: GetterTree<AnotherModuleState, null> = {
  isExistedNoticedPictures(state): boolean {
    if (state.noticedPictures === null) return false
    return state.noticedPictures.length > 0
  },
}

export const mutations: MutationTree<AnotherModuleState> = {
  setTrees(state, trees: Array<object>) {
    state.trees = trees
  },
  setSearchfields(state, payload) {
    const fieldObject: Searchfield = {
      treeId: payload.tree,
      fields: payload.data,
    }
    state.searchFields.push(fieldObject)
  },
  setCurrentFields(state, payload) {
    state.selectedSearchFields = payload
  },
  setSearchParameter(state, payload) {
    state.searchParameter = payload
  },
  loadInViewer(state, payload) {
    state.images = payload
  },
  loadEbeneInfos(state, payload) {
    state.ebeneInfos = payload
  },
  setDrawerL(state, payload) {
    state.drawerL = payload
  },
  setNoticedPictures(state, pic: any) {
    if (state.noticedPictures === null) {
      state.noticedPictures = [pic]
      return
    }
    state.noticedPictures.push(pic)
  },
}

export const actions: ActionTree<AnotherModuleState, null> = {
  async getTreeData(vuexContext) {
    const urlLicense = process.env.baseUrl + '/api/DocumentViewer/GetBaumData'
    const token = vuexContext.rootGetters['auth/token']
    if (token === null) return

    return await $axios({
      method: 'get',
      url: urlLicense,
      headers: {
        authorization: `Bearer  ${token}`,
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      },
    })
      .then((result) => {
        vuexContext.commit('setTrees', result.data)
        return result.data
      })
      .catch((error) => {
        return Promise.reject(error.response)
      })
  },
  async getTreeFields(vuexContext, treeId: number) {
    const apiUrl =
      process.env.baseUrl + '/api/DocumentViewer/GetSearchFields/' + treeId

    const token = vuexContext.rootGetters['auth/token']
    if (token === null) return

    return await this.$axios({
      method: 'get',
      url: apiUrl,
      headers: {
        authorization: `Bearer  ${token}`,
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      },
    })
      .then((result) => {
        vuexContext.commit('setSearchfields', {
          tree: treeId,
          data: result.data,
        })
        vuexContext.commit('setCurrentFields', result.data)
        return {
          tree: treeId,
          data: result.data,
        }
      })
      .catch((error) => {
        return Promise.reject(error.response)
      })
  },
}
