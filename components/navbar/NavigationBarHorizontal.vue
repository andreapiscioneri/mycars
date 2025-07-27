<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n, useLocalePath } from '#imports'
import { auth } from '@/lib/firebase'


const props = defineProps({
  isOpen: Boolean,
  isMobile: Boolean,
  isTablet: Boolean,
})
const emit = defineEmits(['toggle'])

const router = useRouter()
const route = useRoute()

const { t, locale } = useI18n()
const localePath = useLocalePath()

const langs = [
  { code: 'it', emoji: '🇮🇹', label: 'Italiano' },
  { code: 'en', emoji: '🇬🇧', label: 'English' },
]

const dropdownOpen = ref(false)

const selectedLangLabel = computed(() => langs.find(l => l.code === locale.value)!)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const changeLang = (lang: 'it' | 'en') => {
  const fullPath = route.fullPath || '/'
  const rawPath = typeof fullPath === 'string'
    ? fullPath.replace(/^\/(it|en)/, '')
    : '/'

  const targetPath = localePath(rawPath, lang)
  if (typeof targetPath === 'string') {
    navigateTo(targetPath)
    dropdownOpen.value = false
  } else {
    console.warn('localePath returned non-string:', targetPath)
  }
}

const isLoggedIn = ref(false)

const logout = () => {
  auth.signOut()
  localStorage.removeItem('auth')
  router.push('/login')
  if (props.isMobile) emit('toggle')
}

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    isLoggedIn.value = !!user
  })
})

const menuItems = computed(() => {
  const items = [
    { label: "Servizi", route: '/servizi' },
    { label: "Usati", route: '/list/used' },
    { label: "Noleggio", route: '/list/rent' },
    { label: "Chi siamo", route: '/chisiamo' },
    { label: "Dove siamo", route: '/dovesiamo' },
    { label: "Contattaci", route: '/contatti' },
  ]
  if (isLoggedIn.value) {
    items.push({ label: "Area Riservata", route: '/admin' })
  }
  return items
})
</script>

<template>
  <!-- Hamburger (mobile only) -->
  <button
    v-if="isMobile"
    @click="emit('toggle')"
    class="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white text-2xl focus:outline-none hover:bg-black/90 transition-all duration-200"
  >
    <span class="w-6 h-6 flex items-center justify-center">☰</span>
  </button>

  <!-- Sidebar --> 
  <aside
    :class="[
      'transition-all duration-500 ease-in-out shadow-xl z-40',
      isMobile
        ? (isOpen ? 'fixed inset-0 w-full sm:w-80 bg-black' : 'hidden')
        : 'fixed top-0 left-0 h-full bg-black ' + 
          (isTablet 
            ? (isOpen ? 'w-72' : 'w-16') 
            : (isOpen ? 'w-80' : 'w-20')
          )
    ]"
  >
    <!-- Mobile overlay background -->
    <div 
      v-if="isMobile && isOpen" 
      @click="emit('toggle')"
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
    ></div>
    
    <!-- Sidebar content -->
    <div 
      :class="[
        'relative flex flex-col h-full items-start',
        isMobile ? 'w-80 bg-black ml-auto' : 'w-full'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-start justify-start py-4 sm:py-6 pl-4 cursor-pointer w-full" @click="router.push('/')">
        <img 
          src="/static/images/mycarslogo.png" 
          alt="MyCars Logo" 
          :class="[
            'transition-all duration-300',
            isOpen || isMobile ? 'h-10 sm:h-12' : 'h-6 sm:h-8'
          ]" 
        />
      </div>

      <!-- Toggle (desktop and tablet only) -->
      <button
        v-if="!isMobile"
        @click="emit('toggle')"
        class="text-white text-lg sm:text-xl px-4 pb-4 sm:pb-6 focus:outline-none self-start hover:text-[#A30000] transition-colors"
      >
        <span v-if="!isOpen">☰</span>
        <span v-else>←</span>
      </button>

      <!-- Close button (mobile only) -->
      <button
        v-if="isMobile"
        @click="emit('toggle')"
        class="absolute top-4 right-4 text-white text-2xl focus:outline-none hover:text-[#A30000] transition-colors"
      >
        ✕
      </button>

      <!-- Menu items -->
      <nav class="flex-1 text-white font-light text-base sm:text-lg space-y-6 sm:space-y-8 px-4 sm:px-6 mt-4 flex flex-col justify-start items-start w-full">
        <div
          v-for="item in menuItems"
          :key="item.route"
          class="cursor-pointer transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-start w-full hover:text-[#A30000] hover:translate-x-1"
          :class="[route.path === item.route ? 'text-[#A30000] font-medium' : '']"
          @click="() => { router.push(item.route); if (isMobile) emit('toggle') }"
        >
          <span class="block">
            {{ isOpen || isMobile ? item.label : '•' }}
          </span>
        </div>
        
        <!-- Logout button (only when logged in) -->
        <div
          v-if="isLoggedIn"
          class="cursor-pointer transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-start text-red-500 hover:text-red-400 w-full hover:translate-x-1"
          @click="logout"
        >
          <svg v-if="isOpen || isMobile" class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          {{ isOpen || isMobile ? 'Logout' : '•' }}
        </div>
      </nav>

      <!-- Lingua e login -->
      <div class="px-4 sm:px-6 pb-4 sm:pb-6 mt-auto flex flex-col gap-3 sm:gap-4 text-white relative w-full">
        <!-- Language Selector -->
        <div class="relative flex justify-start">
          <button
            @click="toggleDropdown"
            class="flex items-center justify-start hover:text-[#A30000] focus:outline-none transition-all duration-200 hover:scale-110"
          >
            <span class="text-xl sm:text-2xl">{{ selectedLangLabel?.emoji }}</span>
            <span v-if="isOpen || isMobile" class="ml-2 text-sm">{{ selectedLangLabel?.label }}</span>
          </button>

          <div
            v-if="dropdownOpen"
            class="absolute bottom-full mb-2 w-40 bg-white text-black rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div
              v-for="lang in langs"
              :key="lang.code"
              @click="changeLang(lang.code as 'it' | 'en')"
              class="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <span>{{ lang.emoji }}</span>
              <span class="text-sm">{{ lang.label }}</span>
            </div>
          </div>
        </div>

        <!-- Login -->
        <div
          class="cursor-pointer flex items-center gap-2 hover:text-[#A30000] transition-all duration-200 hover:translate-x-1"
          @click="() => { isLoggedIn ? router.push('/') : router.push('/login') }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A10.978 10.978 0 0112 15c2.237 0 4.307.655 6.002 1.772M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span v-if="isOpen || isMobile" class="text-sm">
            {{ isLoggedIn ? 'Ciao admin' : 'Accedi' }}
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
