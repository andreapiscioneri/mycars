<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
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

// Chiudi dropdown quando si clicca fuori
const closeDropdownOnClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-selector')) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    isLoggedIn.value = !!user
  })
  
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
})

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
  
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
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
    :aria-label="isOpen ? 'Chiudi menu' : 'Apri menu'"
    :aria-expanded="isOpen"
    class="fixed top-3 left-3 z-50 bg-black/90 backdrop-blur-sm rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#A30000] hover:bg-black transition-all duration-200 shadow-lg"
    :class="{ 'hamburger-active': isOpen }"
  >
    <div class="w-5 h-5 flex flex-col justify-between">
      <span 
        class="block w-full h-0.5 bg-white transition-all duration-300 origin-center"
        :class="{ 'rotate-45 translate-y-1': isOpen }"
      ></span>
      <span 
        class="block w-full h-0.5 bg-white transition-all duration-300"
        :class="{ 'opacity-0': isOpen }"
      ></span>
      <span 
        class="block w-full h-0.5 bg-white transition-all duration-300 origin-center"
        :class="{ '-rotate-45 -translate-y-1': isOpen }"
      ></span>
    </div>
  </button>

  <!-- Sidebar --> 
  <aside
    :class="[
      'transition-all duration-300 ease-in-out shadow-2xl z-40 border-r border-gray-800',
      isMobile
        ? (isOpen ? 'fixed inset-0 w-full bg-black' : 'hidden')
        : 'fixed top-0 left-0 h-full bg-black ' + 
          (isTablet 
            ? (isOpen ? 'w-72' : 'w-16') 
            : (isOpen ? 'w-80' : 'w-20')
          )
    ]"
  >
    <!-- Mobile overlay background -->
        <!-- Mobile overlay background -->
    <div 
      v-if="isMobile && isOpen" 
      @click="emit('toggle')"
      class="absolute inset-0 bg-black/80 backdrop-blur-sm"
    ></div>
    
    <!-- Sidebar content -->
    <div 
      :class="[
        'relative flex flex-col h-full',
        isMobile ? 'w-80 bg-black ml-auto border-l border-gray-700' : 'w-full'
      ]"
    >
      <!-- Close button (mobile only) - positioned at top right -->
      <button
        v-if="isMobile"
        @click="emit('toggle')"
        class="absolute top-4 right-4 text-white text-xl focus:outline-none hover:text-[#A30000] transition-colors z-10"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Logo -->
      <div class="flex items-center justify-start py-6 px-4 cursor-pointer" @click="router.push('/')">
        <img 
          src="/static/images/mycarslogo.png" 
          alt="MyCars Logo" 
          :class="[
            'transition-all duration-300',
            isOpen || isMobile ? 'h-12' : 'h-8'
          ]" 
        />
        <span 
          v-if="isOpen || isMobile" 
          class="ml-3 text-white font-semibold text-lg tracking-wide"
        >
          MyCars
        </span>
      </div>

      <!-- Toggle (desktop and tablet only) -->
      <div v-if="!isMobile" class="px-4 pb-6">
        <button
          @click="emit('toggle')"
          class="text-white text-xl focus:outline-none hover:text-[#A30000] transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <svg v-if="!isOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- Menu items -->
      <nav class="flex-1 text-white px-4 mt-4 overflow-y-auto">
        <div class="space-y-2">
          <div
            v-for="item in menuItems"
            :key="item.route"
            class="group cursor-pointer transition-all duration-200 rounded-lg hover:bg-white/5"
            :class="[route.path === item.route ? 'bg-[#A30000]/20 border-l-4 border-[#A30000]' : '']"
            @click="() => { router.push(item.route); if (isMobile) emit('toggle') }"
          >
            <div class="flex items-center px-3 py-3">
              <div 
                v-if="!isOpen && !isMobile" 
                class="w-2 h-2 rounded-full bg-white group-hover:bg-[#A30000] transition-colors"
                :class="[route.path === item.route ? 'bg-[#A30000]' : '']"
              ></div>
              <span 
                v-if="isOpen || isMobile" 
                class="text-sm font-medium group-hover:text-[#A30000] transition-colors"
                :class="[route.path === item.route ? 'text-[#A30000]' : '']"
              >
                {{ item.label }}
              </span>
            </div>
          </div>
          
          <!-- Logout button (only when logged in) -->
          <div
            v-if="isLoggedIn"
            class="group cursor-pointer transition-all duration-200 rounded-lg hover:bg-red-500/10"
            @click="logout"
          >
            <div class="flex items-center px-3 py-3 text-red-400 hover:text-red-300">
              <svg v-if="isOpen || isMobile" class="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <div 
                v-if="!isOpen && !isMobile" 
                class="w-2 h-2 rounded-full bg-red-400"
              ></div>
              <span v-if="isOpen || isMobile" class="text-sm font-medium">Logout</span>
            </div>
          </div>
        </div>
      </nav>

      <!-- Lingua e login -->
      <div class="px-4 pb-6 mt-auto border-t border-gray-800 pt-4">
        <div class="space-y-3">
          <!-- Language Selector -->
          <div class="relative language-selector">
            <button
              @click="toggleDropdown"
              class="w-full flex items-center justify-start p-2 rounded-lg hover:bg-white/5 transition-all duration-200 group"
            >
              <span class="text-xl mr-3">{{ selectedLangLabel?.emoji }}</span>
              <span v-if="isOpen || isMobile" class="text-sm text-white group-hover:text-[#A30000]">
                {{ selectedLangLabel?.label }}
              </span>
            </button>

            <div
              v-if="dropdownOpen"
              class="absolute bottom-full mb-2 w-full bg-white text-black rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div
                v-for="lang in langs"
                :key="lang.code"
                @click="changeLang(lang.code as 'it' | 'en')"
                class="px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span class="text-lg">{{ lang.emoji }}</span>
                <span class="text-sm font-medium">{{ lang.label }}</span>
              </div>
            </div>
          </div>

          <!-- Login -->
          <button
            class="w-full flex items-center justify-start p-2 rounded-lgs transition-all duration-200 group"
            @click="() => { isLoggedIn ? router.push('/') : router.push('/login') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="bg-white w-5 h-5 mr-3 flex-shrink-0 group-hover:text-[#A30000] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A10.978 10.978 0 0112 15c2.237 0 4.307.655 6.002 1.772M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span v-if="isOpen || isMobile" class="text-sm text-white group-hover:text-[#A30000] transition-colors">
              {{ isLoggedIn ? 'Ciao admin' : 'Accedi' }}
            </span>
          </button>
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

/* Custom scrollbar for navigation */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(163, 0, 0, 0.3);
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(163, 0, 0, 0.5);
}

/* Animation for hamburger menu */
@keyframes hamburger {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
}

.hamburger-active {
  animation: hamburger 0.3s ease-in-out;
}

/* Smooth border animation for active menu items */
.menu-item-active {
  position: relative;
  overflow: hidden;
}

.menu-item-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(163, 0, 0, 0.1), transparent);
  transition: left 0.5s;
}

.menu-item-active:hover::before {
  left: 100%;
}
</style>
