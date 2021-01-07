import { Middleware } from '@nuxt/types'
const checkAuth: Middleware = (context) => {
  context.store.dispatch('auth/initAuth', context.req)
}
export default checkAuth
