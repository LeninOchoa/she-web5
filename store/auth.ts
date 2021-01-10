import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { sheStore, viewerStore } from '@/store'
// @ts-ignore
import Cookies from 'js-cookie'
import SyniosModules from '../models/SyniosModules'
import Login from '../models/Login'
import { $axios } from '~/utils/axios'

@Module({
  name: 'auth',
  namespaced: true,
  stateFactory: true,
})
export default class auth extends VuexModule {
  token: string | null = null
  syniosModules: SyniosModules[] = [{ Name: 'Dokumentviewer', link: '/viewer' }]

  get isAutheticated(): boolean {
    return this.token != null
  }

  get synModules(): SyniosModules[] {
    return this.syniosModules
  }

  get syniosToken(): string | null {
    let tCopy = this.token
    if (tCopy === null) return null
    if (tCopy[0] === '"') {
      tCopy = tCopy.substring(1, tCopy.length - 1)
    }
    return tCopy
  }

  @Mutation
  setToken(token: string | null): void {
    this.token = token
  }

  @Mutation
  clearToken(): void {
    this.token = null
  }

  @Action
  async logout(): Promise<void> {
    const token = this.token
    this.clearToken()

    Cookies.remove('jwt')
    Cookies.remove('expirationDate')
    sheStore.setFrauParameter(null)

    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
      if (token === null) return
      const logoutUrl = process.env.baseUrl + '/api/account/logout'

      sheStore.showCounter(false)
      sheStore.leftTimeCounter(0)

      return await $axios({
        method: 'get',
        url: logoutUrl,
        headers: {
          authorization: `Bearer  ${token}`,
          'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
        },
      })
        .then(() => {})
        .catch((error) => {
          return Promise.reject(error.response)
        })
    }
  }

  @Action
  async authenticateUser(authData: Login): Promise<boolean> {
    const authUrl = process.env.baseUrl + '/token'
    const body = `grant_type=password&username=${authData.login}&password=${authData.password}&scope=viewer`
    return await $axios({
      method: 'post',
      url: authUrl,
      data: body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then((result) => {
        const expiredIn = Number.parseInt(result.data.expires_in) * 1000
        this.setToken(result.data.access_token)
        localStorage.setItem('token', result.data.access_token)
        localStorage.setItem(
          'tokenExpiration',
          String(new Date().getTime() + expiredIn)
        )
        Cookies.set('jwt', result.data.access_token)
        Cookies.set('expirationDate', String(new Date().getTime() + expiredIn))

        sheStore.leftTimeCounter(expiredIn)
        sheStore.showCounter(true)
        viewerStore.clearNoticedPicturesToNull()

        return true
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e)
        return Promise.reject(e)
      })
  }

  @Action
  initAuth(req: any): void {
    let token: string | null
    let expirationDate: string | null
    if (req) {
      if (!req.headers.cookie) {
        return
      }
      const jwtCookie = req.headers.cookie
        .split(';')
        .find((c: string) => c.trim().startsWith('jwt='))
      if (!jwtCookie) {
        return
      }
      token = jwtCookie.split('=')[1]
      expirationDate = req.headers.cookie
        .split(';')
        .find((c: string) => c.trim().startsWith('expirationDate='))
        .split('=')[1]
    } else {
      token = localStorage.getItem('token')
      expirationDate = localStorage.getItem('tokenExpiration')
    }
    if (
      expirationDate === null ||
      new Date().getTime() > +expirationDate ||
      !token
    ) {
      // eslint-disable-next-line no-console
      console.log('No token or invalid token')
      this.context.dispatch('logout').then(() => {})
      return
    }
    this.setToken(token)
  }
}
