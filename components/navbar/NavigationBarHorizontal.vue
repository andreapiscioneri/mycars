<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isLogged = ref(false)
const router = useRouter()

onMounted(() => {
  isLogged.value = localStorage.getItem('auth') === 'true'
})

const logout = () => {
  localStorage.removeItem('auth')
  isLogged.value = false
  router.push('/')
}
</script>

<template>
  <header class="bg-black text-white border-b border-blue-800">
    <!-- Top Bar -->
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Sinistra: Ricerca -->
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
        </svg>
        <input
          type="text"
          placeholder="Cerca..."
          class="bg-transparent border-none focus:outline-none text-sm placeholder-white w-28 sm:w-40"
        />
      </div>

      <!-- Centro: Logo -->
      <div class="text-center">
        <img src="/static/images/mycarslogo.png" alt="MyCars Logo" class="h-10 mx-auto" />
      </div>

      <!-- Destra: Lingua -->
      <div class="flex items-center gap-3 text-sm">
        <span class="text-xs">🇮🇹</span>
      </div>
    </div>

    <!-- Menu principale -->
    <nav class="max-w-7xl mx-auto px-4 flex justify-between items-center border-t border-blue-800 text-sm">
      <NuxtLink to="/" class="flex-1 text-center py-3 hover:underline">Homepage</NuxtLink>
      <NuxtLink to="/veicoli" class="flex-1 text-center py-3 hover:underline">Elenco veicoli</NuxtLink>
      <NuxtLink to="/chisiamo" class="flex-1 text-center py-3 hover:underline">Chi siamo</NuxtLink>
      <NuxtLink to="/contatti" class="flex-1 text-center py-3 hover:underline">Contatti</NuxtLink>

      <template v-if="isLogged">
        <NuxtLink to="/area-riservata" class="flex-1 text-center py-3 hover:underline">Area riservata</NuxtLink>
        <button @click="logout" class="flex-1 text-center py-3 hover:underline text-red-500">Logout</button>
      </template>
      <template v-else>
        <NuxtLink to="/login" class="flex-1 text-center py-3 hover:underline">Login</NuxtLink>
      </template>
    </nav>
  </header>
</template>
