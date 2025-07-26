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
    <section class="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
      <div class="w-full max-w-md bg-white/5 backdrop-blur-lg p-8 rounded-lg shadow-lg space-y-6">
        <h1 class="text-2xl font-bold text-white text-center">Area Riservata</h1>

        <div v-if="!showReset" class="space-y-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded"
            autocomplete="username"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded"
            autocomplete="current-password"
          />
          <button
            @click="login"
            class="w-full bg-[#A30000] hover:bg-red-800 text-white py-2 rounded font-semibold transition"
          >
            Accedi
          </button>
          <p
            class="text-sm text-center underline cursor-pointer text-white/70 hover:text-white"
            @click="showReset = true"
          >
            Password dimenticata?
          </p>
        </div>

        <div v-else class="space-y-4">
          <p class="text-sm text-white/80 text-center">
            Inserisci la tua email per reimpostare la password:
          </p>
          <input
            v-model="resetEmail"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded"
          />
          <button
            @click="resetPassword"
            class="w-full bg-[#A30000] hover:bg-red-800 text-white py-2 rounded font-semibold transition"
          >
            Invia nuova password
          </button>
          <p
            class="text-sm text-center underline cursor-pointer text-white/70 hover:text-white"
            @click="showReset = false"
          >
            Torna al login
          </p>
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center" role="alert">
          {{ error }}
        </div>
      </div>
    </section>
  </main>
</template>
