<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '#imports'

const user = ref('')
const pass = ref('')
const router = useRouter()
const showReset = ref(false)
const resetEmail = ref('')
const error = ref('')

useHead({
  title: 'Login Area Riservata | MyCars',
  meta: [
    {
      name: 'description',
      content: 'Accedi all’area riservata di MyCars per gestire i tuoi veicoli, annunci e contatti. Accesso protetto per utenti autorizzati.'
    },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Login Area Riservata | MyCars' },
    {
      property: 'og:description',
      content: 'Pagina di accesso all’area riservata di MyCars Bergamo.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/login' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/login' }
  ]
})

const users = [
  { username: 'admin', password: '1234' },
  { username: 'andrypiscioneri@gmail.com', password: 'andrea' },
  { username: 'umberto', password: 'azzolin' },
]

const login = () => {
  error.value = ''
  const match = users.find(
    (u) => u.username === user.value && u.password === pass.value
  )

  if (match) {
    localStorage.setItem('auth', 'true')
    localStorage.setItem('user', user.value)
    router.push('/area-riservata')
  } else {
    error.value = 'Credenziali errate. Riprova.'
  }
}

const resetPassword = () => {
  error.value = ''
  const match = users.find((u) => u.username === resetEmail.value)

  if (match) {
    alert(`È stata inviata una nuova password a: ${resetEmail.value}`)
    showReset.value = false
    resetEmail.value = ''
  } else {
    error.value = 'Indirizzo email non autorizzato.'
  }
}
</script>

<template>
  <main>
    <section
      class="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20"
      aria-labelledby="login-title"
    >
      <div class="w-full max-w-md bg-white/5 backdrop-blur-lg p-8 rounded-lg shadow-lg space-y-6">
        <h1 id="login-title" class="text-2xl font-bold text-white text-center">
          Area Riservata
        </h1>

        <div v-if="!showReset" class="space-y-4" aria-label="Form login">
          <input
            v-model="user"
            type="text"
            placeholder="Email o Username"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#A30000]"
            autocomplete="username"
            aria-label="Email o Username"
          />
          <input
            v-model="pass"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#A30000]"
            autocomplete="current-password"
            aria-label="Password"
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
            aria-label="Password dimenticata"
          >
            Password dimenticata?
          </p>
        </div>

        <div v-else class="space-y-4" aria-label="Form recupero password">
          <p class="text-sm text-white/80 text-center">
            Inserisci la tua email per il recupero password:
          </p>
          <input
            v-model="resetEmail"
            type="email"
            placeholder="Email autorizzata"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#A30000]"
            autocomplete="email"
            aria-label="Email per reset password"
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
            aria-label="Torna al login"
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
