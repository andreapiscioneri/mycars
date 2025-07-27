<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase' // ✅ giusto percorso
import { useHead } from '#imports'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const showReset = ref(false)
const resetEmail = ref('')

useHead({
  title: 'Login Area Riservata | MyCars',
  meta: [
    { name: 'description', content: 'Accedi all’area riservata di MyCars per gestire i tuoi veicoli.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Login Area Riservata | MyCars' },
    { property: 'og:description', content: 'Accesso sicuro a MyCars Bergamo.' },
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
        error.value = 'Utente non trovato.'
        break
      case 'auth/wrong-password':
        error.value = 'Password errata.'
        break
      case 'auth/invalid-email':
        error.value = 'Email non valida.'
        break
      default:
        error.value = 'Email o password non validi.'
    }
  }
}

const resetPassword = async () => {
  error.value = ''
  try {
    await sendPasswordResetEmail(auth, resetEmail.value)
    alert(`Email inviata a ${resetEmail.value}`)
    showReset.value = false
    resetEmail.value = ''
  } catch (err: any) {
    console.error('❌ Errore reset password:', err)
    error.value = 'Email non trovata o errore di rete.'
  }
}
</script>

<template>
  <main>
    <section class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-4 py-20">
      <div class="w-full max-w-md">
        <!-- Logo/Brand area -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">MyCars</h1>
          <p class="text-gray-300">Login</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-6">
          <div v-if="!showReset" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-200 mb-2">Email</label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Inserisci la tua email"
                  class="w-full px-4 py-3 bg-white/10 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-300"
                  autocomplete="username"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-200 mb-2">Password</label>
                <input
                  v-model="password"
                  type="password"
                  placeholder="Inserisci la tua password"
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
              Accedi
            </button>
            
            <div class="text-center">
              <button
                @click="showReset = true"
                class="text-sm text-gray-300 hover:text-white transition-colors underline"
              >
                Password dimenticata?
              </button>
            </div>
          </div>

          <!-- Password Reset Form -->
          <div v-else class="space-y-6">
            <div class="text-center">
              <svg class="w-12 h-12 text-[#A30000] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              <h3 class="text-xl font-semibold text-white mb-2">Reimposta Password</h3>
              <p class="text-sm text-gray-300">
                Inserisci la tua email per ricevere le istruzioni per reimpostare la password
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input
                v-model="resetEmail"
                type="email"
                placeholder="Inserisci la tua email"
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
              Invia Email di Reset
            </button>
            
            <div class="text-center">
              <button
                @click="showReset = false"
                class="text-sm text-gray-300 hover:text-white transition-colors underline flex items-center justify-center gap-1 mx-auto"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Torna al login
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
          <p class="text-gray-400 text-sm">© 2024 MyCars Bergamo. Tutti i diritti riservati.</p>
        </div>
      </div>
    </section>
  </main>
</template>
