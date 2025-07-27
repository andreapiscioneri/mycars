<template>
  <div 
    v-if="isLoading" 
    class="loading-screen"
    :class="{ 'fade-out': fadeOut }"
  >
    <div class="loader-content">
      <div class="logo-container">
        <img 
          src="/static/images/mycarslogowhite.png" 
          alt="MyCars Logo" 
          class="logo pulse-animation"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const fadeOut = ref(false)

const emit = defineEmits<{
  loadingComplete: []
}>()

onMounted(() => {
  // Dopo 1.8 secondi inizia il fade out
  setTimeout(() => {
    fadeOut.value = true
    
    // Dopo l'animazione di fade out (0.2s), nasconde completamente il loader
    setTimeout(() => {
      isLoading.value = false
      emit('loadingComplete')
    }, 200)
  }, 1500)
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.2s ease-out;
}

.loading-screen.fade-out {
  opacity: 0;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  max-width: 200px;
  width: 200px;
  height: auto;
  filter: brightness(1.1) contrast(1.1);
}

.pulse-animation {
  animation: slowPulse 2s infinite ease-in-out;
}

@keyframes slowPulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .logo {
    max-width: 150px;
    width: 150px;
  }
}

@media (max-width: 480px) {
  .logo {
    max-width: 120px;
    width: 120px;
  }
}

@media (max-width: 320px) {
  .logo {
    max-width: 100px;
    width: 100px;
  }
}

/* Tablet responsive */
@media (min-width: 768px) and (max-width: 1024px) {
  .logo {
    max-width: 180px;
    width: 180px;
  }
}

/* Large screens */
@media (min-width: 1200px) {
  .logo {
    max-width: 250px;
    width: 250px;
  }
}
</style>
