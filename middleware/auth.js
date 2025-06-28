export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = useCookie('loggedIn')
  if (!isLoggedIn.value && to.path === '/area-riservata') {
    return navigateTo('/login')
  }
})
