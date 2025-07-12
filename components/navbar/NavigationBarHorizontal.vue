<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  isOpen: Boolean,
  isMobile: Boolean,
})
const emit = defineEmits(['toggle'])

const router = useRouter()
const route = useRoute()

const { locale, t } = useI18n()
const selectedLang = ref(locale.value)
const langs = [
  { code: 'it', emoji: '🇮🇹', label: 'Italiano' },
  { code: 'en', emoji: '🇬🇧', label: 'English' },
]


const dropdownOpen = ref(false)

const selectedLangLabel = computed(() => {
  return langs.find((l) => l.code === selectedLang.value) || langs[0]
})


const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const changeLang = (lang: string) => {
  locale.value = lang
  selectedLang.value = lang
  dropdownOpen.value = false
}

const menuItems = computed(() => [
  { key: 'services', route: '/servizi' },
  { key: 'used', route: '/usato' },
  { key: 'rent', route: '/noleggio' },
  { key: 'about', route: '/chisiamo' },
  { key: 'where', route: '/dovesiamo' },
  { key: 'contact', route: '/contatti' }
].map(item => ({
  label: t(`menu.${item.key}`),
  route: item.route
})))

</script>

<template>
  <!-- Hamburger (mobile only) -->
  <button
    v-if="isMobile"
    @click="emit('toggle')"
    class="fixed top-4 left-4 z-50 text-white text-3xl focus:outline-none md:hidden"
  >
    ☰
  </button>

  <!-- Sidebar -->
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

      <!-- Toggle (desktop only) -->
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

      <!-- Lingua e login -->
      <div class="px-6 pb-6 mt-auto flex flex-col gap-4 text-white relative">
        <!-- Language Selector -->
        <div class="relative">
          <button
            @click="toggleDropdown"
            class="w-full flex items-center justify-left md:justify-between hover:text-[#A30000] focus:outline-none transition-all"
          >
            <span class="text-xl">{{ selectedLangLabel.emoji }}</span>
            <transition name="fade">
              <span v-show="isOpen || isMobile" class="ml-1 font-semibold whitespace-nowrap">
                {{ selectedLangLabel.label }}
              </span>
            </transition>
          </button>

          <div
            v-if="dropdownOpen"
            class="absolute bottom-full mb-2 w-40 bg-white text-black rounded shadow z-50"
          >
            <div
              v-for="lang in langs"
              :key="lang.code"
              @click="changeLang(lang.code)"
              class="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
              :class="selectedLang === lang.code ? 'font-bold bg-gray-200' : ''"
            >
              <span>{{ lang.emoji }}</span>
              <span>{{ lang.label }}</span>
            </div>
          </div>
        </div>

        <!-- Login -->
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

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
