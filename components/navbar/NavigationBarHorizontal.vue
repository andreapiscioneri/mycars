<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()

function goToLogin() {
  router.push('/login')
}

// i18n
const { t, locale } = useI18n()
const flagMap: Record<string, string> = { it: '🇮🇹', en: '🇬🇧', de: '🇩🇪' }
const currentFlag = computed(() => flagMap[locale.value] || '🌐')
const locales = [
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' }
]
const showLangMenu = ref(false)
const isMobileOpen = ref(false)
const searchQuery = ref("")

function switchLocalePath(code: string) {
  const pathWithoutLocale = route.fullPath.replace(/^\/[a-z]{2}/, '')
  return `/${code}${pathWithoutLocale}`
}

function handleSearch() {
  if (!searchQuery.value.trim()) return
  router.push({ path: "/search", query: { q: searchQuery.value } })
}
</script>

<template>
  <nav class="bg-black text-white font-light text-sm">
    <div class="relative flex items-center justify-between px-4 md:px-20 py-3">

      <!-- Search -->
      <div class="flex-shrink-0">
        <form @submit.prevent="handleSearch">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('search')"
            class="bg-transparent border-b border-white/40 text-white text-xs px-2 py-1 outline-none placeholder-white/60"
            @keyup.enter="handleSearch"
          />
        </form>
      </div>

      <!-- Logo -->
      <div class="absolute left-1/2 transform -translate-x-1/2 text-center">
        <NuxtLink to="/">
          <img src="/public/static/images/site/navbar/logobrennero.png" alt="Brennero Gru" class="h-8 md:h-12 mx-auto" />
        </NuxtLink>
      </div>

      <!-- Right Controls -->
      <div class="relative flex items-center gap-4 flex-shrink-0 flex-row-reverse md:flex-row">

        <!-- Hamburger menu (mobile only) -->
        <button
          @click="isMobileOpen = !isMobileOpen"
          class="md:hidden inline-flex items-center justify-center p-2 text-white"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- BG LIFT desktop only -->
        <a href="https://bglift.com/" target="_blank" class="hidden md:block">
          <img src="/public/static/images/site/navbar/bglift.png" alt="BG LIFT" class="h-4" />
        </a>

        <!-- Login/Logout icon only -->
        <button

          class="p-2 bg-black rounded hover:bg-white/10 transition"
        >
          <img src="/public/static/images/site/account.png" alt="account icon" class="w-5 h-5" />
        </button>

        <!-- Language switch -->
        <div class="relative">
          <button
            @click="showLangMenu = !showLangMenu"
            class="inline-flex items-center justify-center rounded-md border border-white/30 px-3 py-1 text-sm font-medium text-white bg-black hover:bg-blue-900 transition"
          >
            {{ currentFlag }}
          </button>

          <div
            v-if="showLangMenu"
            class="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          >
            <div class="py-1">
              <NuxtLink
                v-for="lang in locales"
                :key="lang.code"
                :to="switchLocalePath(lang.code)"
                class="block px-4 py-2 text-sm text-black hover:bg-blue-100"
                @click="showLangMenu = false"
              >
                {{ flagMap[lang.code] }} {{ lang.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation menu -->
    <NavigationMenu class="w-full max-w-full mx-auto items-center px-4 md:px-20 py-2">
      <div class="w-full bg-black text-white text-sm font-medium border-t md:border-blue-400 border-black">

        <!-- Responsive wrapper -->
        <div
          :class="[
            isMobileOpen ? 'block' : 'hidden',
            'md:flex md:justify-center md:items-center divide-y md:divide-y-0 md:divide-x divide-blue-700'
          ]"
          class="bg-black text-white"
        >
          <div class="max-w-7xl mx-auto px-4">
            <NavigationMenuList class="flex flex-col md:flex-row text-sm font-medium">
              <NavigationMenuItem class="px-6 py-3 hover:bg-blue-900 transition">
                <NuxtLink to="/servizi">{{ t('menu.services') }}</NuxtLink>
              </NavigationMenuItem>
              <NavigationMenuItem class="px-6 py-3 hover:bg-blue-900 transition">
                <NuxtLink to="/usato">{{ t('menu.used') }}</NuxtLink>
              </NavigationMenuItem>
              <NavigationMenuItem class="px-6 py-3 hover:bg-blue-900 transition">
                <NuxtLink to="/allestimenti">{{ t('menu.fittings') }}</NuxtLink>
              </NavigationMenuItem>
              <NavigationMenuItem class="px-6 py-3 hover:bg-blue-900 transition">
                <NuxtLink to="/news">{{ t('menu.news') }}</NuxtLink>
              </NavigationMenuItem>
              <NavigationMenuItem class="px-6 py-3 hover:bg-blue-900 transition">
                <NuxtLink to="/chisiamo">{{ t('menu.about') }}</NuxtLink>
              </NavigationMenuItem>
              <NavigationMenuItem class="px-6 py-3 hover:bg-blue-900 transition">
                <NuxtLink to="/dovesiamo">{{ t('menu.location') }}</NuxtLink>
              </NavigationMenuItem>
              <NavigationMenuItem class="px-6 py-3 hover:bg-blue-900 transition">
                <NuxtLink to="/contatti">{{ t('menu.contact') }}</NuxtLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </div>
        </div>
      </div>
    </NavigationMenu>
  </nav>
</template>
