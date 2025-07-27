<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase' // ✅ giusto percorso

const router = useRouter()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const error = ref('')
const showReset = ref(false)
const resetEmail = ref('')

useHead({
  title: t('login.title'),
  meta: [
    { name: 'description', content: t('login.meta.description') },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: t('login.meta.ogTitle') },
    { property: 'og:description', content: t('login.meta.ogDescription') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/login' }
  ],
  link: [{ rel: 'canonical', href: 'https://www.mycarsbergamo.it/login' }]
})

const login = async () => {
  error.value = ''
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('✅ Login avvenuto:', userCredential.user.email)
    router.push('/admin')
  } catch (err: any) {
    console.error('❌ Errore login Firebase:', err.code, err.message)
    
    // Mostra errore più specifico se vuoi
    switch (err.code) {
      case 'auth/user-not-found':
        error.value = t('login.errors.userNotFound')
        break
      case 'auth/wrong-password':
        error.value = t('login.errors.wrongPassword')
        break
      case 'auth/invalid-email':
        error.value = t('login.errors.invalidEmail')
        break
      default:
        error.value = t('login.errors.invalidCredentials')
    }
  }
}

const resetPassword = async () => {
  error.value = ''
  try {
    await sendPasswordResetEmail(auth, resetEmail.value)
    alert(t('login.resetPassword.successMessage', { email: resetEmail.value }))
    showReset.value = false
    resetEmail.value = ''
  } catch (err: any) {
    console.error('❌ Errore reset password:', err)
    error.value = t('login.errors.resetEmailNotFound')
  }
}
</script>

<template>
  <main>
    <section class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-4 py-20">
      <div class="w-full max-w-md">
        <!-- Logo/Brand area -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">{{ t('login.brand.name') }}</h1>
          <p class="text-gray-300">{{ t('login.brand.subtitle') }}</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-6">
          <div v-if="!showReset" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-200 mb-2">{{ t('login.form.email') }}</label>
                <input
                  v-model="email"
                  type="email"
                  :placeholder="t('login.form.emailPlaceholder')"
                  class="w-full px-4 py-3 bg-white/10 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-300"
                  autocomplete="username"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-200 mb-2">{{ t('login.form.password') }}</label>
                <input
                  v-model="password"
                  type="password"
                  :placeholder="t('login.form.passwordPlaceholder')"
                  class="w-full px-4 py-3 bg-white/10 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-300"
                  autocomplete="current-password"
                  @keyup.enter="login"
                />
              </div>
            </div>
            
            <button
              @click="login"
              class="w-full bg-[#A30000] hover:bg-red-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              {{ t('login.form.loginButton') }}
            </button>
            
            <div class="text-center">
              <button
                @click="showReset = true"
                class="text-sm text-gray-300 hover:text-white transition-colors underline"
              >
                {{ t('login.form.forgotPassword') }}
              </button>
            </div>
          </div>

          <!-- Password Reset Form -->
          <div v-else class="space-y-6">
            <div class="text-center">
              <svg class="w-12 h-12 text-[#A30000] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              <h3 class="text-xl font-semibold text-white mb-2">{{ t('login.resetPassword.title') }}</h3>
              <p class="text-sm text-gray-300">
                {{ t('login.resetPassword.description') }}
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">{{ t('login.resetPassword.email') }}</label>
              <input
                v-model="resetEmail"
                type="email"
                :placeholder="t('login.resetPassword.emailPlaceholder')"
                class="w-full px-4 py-3 bg-white/10 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-300"
                @keyup.enter="resetPassword"
              />
            </div>
            
            <button
              @click="resetPassword"
              class="w-full bg-[#A30000] hover:bg-red-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.828 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              {{ t('login.resetPassword.sendButton') }}
            </button>
            
            <div class="text-center">
              <button
                @click="showReset = false"
                class="text-sm text-gray-300 hover:text-white transition-colors underline flex items-center justify-center gap-1 mx-auto"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                {{ t('login.resetPassword.backToLogin') }}
              </button>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center" role="alert">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-red-300 text-sm font-medium">{{ error }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-gray-400 text-sm">{{ t('login.footer.copyright') }}</p>
        </div>
      </div>
    </section>
  </main>
</template>
