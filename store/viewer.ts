import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Searchfield from '@/models/Searchfield'
import BaumData from '@/models/BaumData'
import Field from '@/models/Field'
import { authStore } from '@/store'
import { SearchParameterBaum } from '@/models/SearchParameter'
import { $axios } from '~/utils/axios'

@Module({
  name: 'viewer',
  namespaced: true,
  stateFactory: true,
})
export default class viewer extends VuexModule {
  public trees: BaumData[] = []
  searchFields: Searchfield[] = []
  selectedSearchFields: Searchfield = { treeId: 0, fields: [] }
  searchParameter: SearchParameterBaum | null = null
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
  setTrees(trees: BaumData[]) {
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
  setSearchParameter(payload: SearchParameterBaum) {
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
  async getTreeData(): Promise<BaumData[]> {
    const urlLicense = process.env.baseUrl + '/api/DocumentViewer/GetBaumData'
    const token = authStore.syniosToken
    if (token === null || token === undefined) return []

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
  async getTreeFields(treeId: number): Promise<Searchfield | null> {
    const apiUrl =
      process.env.baseUrl + '/api/DocumentViewer/GetSearchFields/' + treeId

    const token = authStore.syniosToken
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
        const fields: Field[] = []
        for (const index in result.data) {
          const fi = result.data[index] as Field
          fields.push(fi)
        }
        const search: Searchfield = { treeId, fields }
        this.setSearchfields(search)
        this.setCurrentFields(search)

        return search
      })
      .catch((error) => {
        return Promise.reject(error.response)
      })
  }
}
