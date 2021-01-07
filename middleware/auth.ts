import { Middleware } from '@nuxt/types'
const auth: Middleware = (context) => {
  if (context.route.fullPath.includes('/frau')) {
    return
  }

  if (!context.store.getters['auth/isAutheticated']) {
    context.redirect('/signin')
  }
}

export default auth
