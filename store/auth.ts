import { GetterTree, MutationTree, ActionTree } from 'vuex'
// @ts-ignore
import Cookies from 'js-cookie'
import SyniosModules from '../models/SyniosModules'
import Login from '../models/Login'
import { $axios } from '~/utils/axios'

export const state = () => ({
  token: null as String | null,
  modules: [{ Name: 'Dokumentviewer', link: '/viewer' }] as
    | SyniosModules[]
    | null,
})

export type AnotherModuleState = ReturnType<typeof state>

export const getters: GetterTree<AnotherModuleState, null> = {
  isAutheticated(state: any): boolean {
    return state.token != null
  },
  modules(state: any): SyniosModules[] | null {
    return state.modules
  },
  token(state: any): String | null {
    let tCopy = state.token
    if (state.token === null) return null
    if (tCopy[0] === '"') {
      tCopy = tCopy.substring(1, tCopy.length - 1)
    }
    return tCopy
  },
}

export const mutations: MutationTree<AnotherModuleState> = {
  setToken(state: any, token): void {
    state.token = token
  },
  clearToken(state: any): void {
    state.token = null
  },
}

export const actions: ActionTree<AnotherModuleState, null> = {
  async logout(vuexContext): Promise<void> {
    const token = vuexContext.rootGetters['auth/token']
    vuexContext.commit('clearToken')
    Cookies.remove('jwt')
    Cookies.remove('expirationDate')
    vuexContext.commit('she/setFrauParameter', null, { root: true })
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
      if (token === null) return
      const logoutUrl = process.env.baseUrl + '/api/account/logout'

      vuexContext.commit('she/showSessionCounter', false, {
        root: true,
      })

      vuexContext.commit('she/leftTimeSessionCounter', 0, {
        root: true,
      })
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
  },
  async authenticateUser(vuexContext, authData: Login) {
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
        vuexContext.commit('setToken', result.data.access_token)
        localStorage.setItem('token', result.data.access_token)
        localStorage.setItem(
          'tokenExpiration',
          String(new Date().getTime() + expiredIn)
        )
        Cookies.set('jwt', result.data.access_token)
        Cookies.set('expirationDate', String(new Date().getTime() + expiredIn))

        vuexContext.commit('she/leftTimeSessionCounter', expiredIn, {
          root: true,
        })
        vuexContext.commit('she/showSessionCounter', true, {
          root: true,
        })
        return true
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e)
        return Promise.reject(e)
      })
  },
  initAuth(vuexContext, req: any): void {
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
      vuexContext.dispatch('logout')
      return
    }
    vuexContext.commit('setToken', token)
  },
}
