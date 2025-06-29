<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavigationBarHorizontal from '@/components/navbar/NavigationBarHorizontal.vue'
import Footer from '@/components/Footer/Footer.vue'

const isOpen = ref(false)
const isMobile = ref(false)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
</script>

<template>
  <div>
    <!-- Sidebar (desktop) or Overlay (mobile) -->
    <NavigationBarHorizontal :isOpen="isOpen" :isMobile="isMobile" @toggle="isOpen = !isOpen" />

    <!-- Content -->
    <main
      :class="[
        isMobile ? 'ml-0' : isOpen ? 'ml-80' : 'ml-20',
        'transition-all duration-500 ease-in-out'
      ]"
    >
      <NuxtPage />
      <Footer />
    </main>
  </div>
</template>
