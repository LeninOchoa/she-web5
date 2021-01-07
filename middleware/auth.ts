import { Middleware } from '@nuxt/types'
import { authStore } from '@/store'
const auth: Middleware = (context) => {
  if (context.route.fullPath.includes('/frau')) {
    return
  }

  if (!authStore.isAutheticated) {
    context.redirect('/signin')
  }
}

export default auth
