/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import auth from '@/store/auth'
import she from '@/store/she'
import viewer from '@/store/viewer'

let authStore: auth
let sheStore: she
let viewerStore: viewer
function initialiseStores(store: Store<any>): void {
  authStore = getModule(auth, store)
  sheStore = getModule(she, store)
  viewerStore = getModule(viewer, store)
}

export { initialiseStores, authStore, sheStore, viewerStore }
