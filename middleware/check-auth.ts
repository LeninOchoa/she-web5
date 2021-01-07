import { Middleware } from '@nuxt/types'
import { authStore } from '@/store'
const checkAuth: Middleware = (context) => {
  authStore.initAuth(context.req)
}
export default checkAuth
