<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import NavigationBarHorizontal from '@/components/navbar/NavigationBarHorizontal.vue'
import Footer from '@/components/Footer/Footer.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isOpen = ref(false)
const isMobile = ref(false)
const isTablet = ref(false)

const isAdminPage = computed(() => {
  return route.path.includes('/admin')
})

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Sidebar (desktop) or Overlay (mobile) -->
    <NavigationBarHorizontal 
      :isOpen="isOpen" 
      :isMobile="isMobile" 
      :isTablet="isTablet"
      @toggle="isOpen = !isOpen" 
    />

    <!-- Content -->
    <main
      :class="[
        'transition-all duration-500 ease-in-out',
        isMobile ? 'ml-0' : isTablet ? (isOpen ? 'ml-72' : 'ml-16') : (isOpen ? 'ml-80' : 'ml-20')
      ]"
    >
      <NuxtPage />
      <Footer v-if="!isAdminPage" />
    </main>
  </div>
</template>
