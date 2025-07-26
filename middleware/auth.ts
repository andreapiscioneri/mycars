import { auth } from '@/lib/firebase'

export default defineNuxtRouteMiddleware(() => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()

      if (!user) {
        resolve(navigateTo('/login'))
      } else {
        resolve()
      }
    })
  })
})
