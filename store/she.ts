import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import FrauParameter from '../models/FrauParameter'

@Module({
  name: 'she',
  namespaced: true,
  stateFactory: true,
})
export default class she extends VuexModule {
  ShowDrawer: boolean = false
  frauParameter: FrauParameter | null = null
  showSessionCounter: boolean = false
  leftTimeSessionCounter: number = 0

  get showDrawer(): boolean {
    return this.ShowDrawer
  }

  get getFrauParameter(): FrauParameter | null {
    return this.frauParameter
  }

  get isFrau(): boolean {
    return this.frauParameter !== null
  }

  @Mutation
  showMainDrawer(show: boolean): void {
    this.ShowDrawer = show
  }

  @Mutation
  setFrauParameter(frau: FrauParameter | null): void {
    this.frauParameter = frau
  }

  @Mutation
  showCounter(show: boolean): void {
    this.showSessionCounter = show
  }

  @Mutation
  leftTimeCounter(time: number): void {
    this.leftTimeSessionCounter = time
  }
}
