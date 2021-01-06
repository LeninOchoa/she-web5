import { GetterTree, MutationTree } from 'vuex'
import FrauParameter from '../models/FrauParameter'

export const state = () => ({
  ShowDrawer: false as boolean,
  frauParameter: null as FrauParameter | null,
  showSessionCounter: false as boolean,
  leftTimeSessionCounter: 0 as number,
})

export type AnotherModuleState = ReturnType<typeof state>

export const getters: GetterTree<AnotherModuleState, null> = {
  showDrawer(state): boolean {
    return state.ShowDrawer
  },
  getFrauParameter(state): FrauParameter | null {
    return state.frauParameter
  },
  isFrau(state): boolean {
    return state.frauParameter !== null
  },
}

export const mutations: MutationTree<AnotherModuleState> = {
  showDrawer(state: any, show: boolean): void {
    state.ShowDrawer = show
  },
  setFrauParameter(state: any, frau: FrauParameter | null): void {
    state.frauParameter = frau
  },
  showSessionCounter(state: any, show: boolean): void {
    state.showSessionCounter = show
  },
  leftTimeSessionCounter(state: any, time: number): void {
    state.leftTimeSessionCounter = time
  },
}
