import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Searchfield from '@/models/Searchfield'
import { $axios } from '~/utils/axios'
import { authStore } from '~/store'

@Module({
  name: 'viewer',
  namespaced: true,
  stateFactory: true,
})
export default class viewer extends VuexModule {
  trees: Array<object> = []
  searchFields: Searchfield[] = []
  selectedSearchFields: Searchfield | null = null
  searchParameter: Array<object> = []
  images: Array<object> = []
  searchedTree: Array<object> = []
  ebeneInfos: Array<object> = []
  drawerL: boolean = true
  noticedPictures: Array<object> = []

  get isExistedNoticedPictures(): boolean {
    if (this.noticedPictures === null) return false
    return this.noticedPictures.length > 0
  }

  @Mutation
  setTrees(trees: Array<object>) {
    this.trees = trees
  }

  @Mutation
  setSearchfields(payload: Searchfield) {
    this.searchFields.push(payload)
  }

  @Mutation
  setCurrentFields(payload: Searchfield) {
    this.selectedSearchFields = payload
  }

  @Mutation
  setSearchParameter(payload: Array<object>) {
    this.searchParameter = payload
  }

  @Mutation
  loadInViewer(payload: Array<object>) {
    this.images = payload
  }

  @Mutation
  loadEbeneInfos(payload: Array<object>) {
    this.ebeneInfos = payload
  }

  @Mutation
  setDrawerL(payload: boolean) {
    this.drawerL = payload
  }

  @Mutation
  setNoticedPictures(pic: any) {
    if (this.noticedPictures === null) {
      this.noticedPictures = [pic]
      return
    }
    this.noticedPictures.push(pic)
  }

  @Action
  async getTreeData(): Promise<Array<object> | null> {
    const urlLicense = process.env.baseUrl + '/api/DocumentViewer/GetBaumData'
    const token = authStore.token
    if (token === null) return null

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
        this.setTrees(result.data)
        return result.data
      })
      .catch((error) => {
        return Promise.reject(error.response)
      })
  }

  @Action
  async getTreeFields(treeId: number): Promise<object | null> {
    const apiUrl =
      process.env.baseUrl + '/api/DocumentViewer/GetSearchFields/' + treeId

    const token = authStore.token
    if (token === null) return null

    return await $axios({
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
        const search: Searchfield = { treeId, fields: result.data }
        this.setSearchfields(search)
        this.setCurrentFields(search)
        return search
      })
      .catch((error) => {
        return Promise.reject(error.response)
      })
  }
}
