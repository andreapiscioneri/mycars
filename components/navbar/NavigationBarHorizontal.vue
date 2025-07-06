<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  isOpen: Boolean,
  isMobile: Boolean,
})
const emit = defineEmits(['toggle'])

const selectedLang = ref('IT')
const langIcon = computed(() => selectedLang.value === 'IT' ? '🇮🇹' : '🇬🇧')

const router = useRouter()
const route = useRoute()

const menuItems = [
  { label: 'Servizi', route: '/servizi' },
  { label: 'Usato', route: '/usato' },
  { label: 'Noleggio', route: '/noleggio' },
  { label: 'Chi siamo', route: '/chisiamo' },
  { label: 'Dove siamo', route: '/dovesiamo' },
  { label: 'Contatti', route: '/contatti' },
]
const veicoliMenu = [
  { label: 'Usato', route: '/usato' },
  { label: 'Noleggio', route: '/noleggio' }
]

const toggleLang = () => {
  selectedLang.value = selectedLang.value === 'IT' ? 'EN' : 'IT'
}
</script>

<template>
  <!-- Hamburger trigger (mobile only) -->
  <button
    v-if="isMobile"
    @click="emit('toggle')"
    class="fixed top-4 left-4 z-50 text-white text-3xl focus:outline-none md:hidden"
  >
    ☰
  </button>

  <!-- Sidebar / Overlay -->
  <aside
    :class="[
      'transition-all duration-500 ease-in-out shadow-xl z-40',
      isMobile
        ? (isOpen ? 'fixed inset-0 w-64 bg-black' : 'hidden')
        : 'fixed top-0 left-0 h-full ' + (isOpen ? 'w-80' : 'w-20') + ' bg-black'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center justify-center py-6 cursor-pointer" @click="router.push('/')">
        <img src="/static/images/mycarslogo.png" alt="MyCars Logo" :class="[isOpen ? 'h-12' : 'h-8']" />
      </div>

      <!-- Toggle (hidden on mobile since handled externally) -->
      <button
        v-if="!isMobile"
        @click="emit('toggle')"
        class="text-white text-xl px-4 pb-6 focus:outline-none self-start"
      >
        <span v-if="!isOpen">☰</span>
        <span v-else>←</span>
      </button>

      <!-- Menu items -->
<nav class="flex-1 text-white font-light text-lg space-y-8 px-6 mt-4">
<div
  v-for="item in menuItems"
  :key="item.route"
  class="cursor-pointer transition whitespace-nowrap overflow-hidden text-ellipsis"
  :class="[route.path === item.route ? 'text-[#A30000]' : 'hover:text-[#A30000]']"
  @click="() => { router.push(item.route); if (isMobile) emit('toggle') }"
>
  {{ isOpen || isMobile ? item.label : '•' }}
</div>
      </nav>

      <!-- Lingua & Login -->
      <div class="px-6 pb-6 mt-auto flex flex-col gap-4 text-white">
        <div
          class="cursor-pointer flex items-center justify-between hover:text-[#A30000]"
          @click="toggleLang"
        >
          <template v-if="isOpen || isMobile">
            <span>Lingua:</span>
            <span class="flex items-center gap-2 font-semibold">
              {{ selectedLang }} <span>{{ langIcon }}</span>
            </span>
          </template>
          <template v-else>
            <span class="text-xl">{{ langIcon }}</span>
          </template>
        </div>

        <div
          class="cursor-pointer flex items-center gap-2 hover:text-[#A30000]"
          @click="router.push('/login')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A10.978 10.978 0 0112 15c2.237 0 4.307.655 6.002 1.772M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span v-if="isOpen || isMobile" class="text-sm">Login</span>
        </div>
      </div>
    </div>
  </aside>
</template>
