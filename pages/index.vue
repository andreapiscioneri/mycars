<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'Auto Usate e Noleggio a Bergamo - MyCars',
  meta: [
    { name: 'description', content: 'Scopri veicoli usati garantiti, noleggio auto, assistenza e finanziamenti personalizzati. Visita MyCars a Bergamo!' },
    { name: 'keywords', content: 'auto usate Bergamo, noleggio auto Bergamo, veicoli usati, finanziamenti auto, officina autorizzata, MyCars Bergamo' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Auto Usate e Noleggio a Bergamo - MyCars' },
    { property: 'og:description', content: 'Veicoli nuovi e usati certificati, noleggio e assistenza completa. Scopri MyCars!' },
    { property: 'og:image', content: 'https://www.mycarsbergamo.it/static/images/5.jpg' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it' },
    { property: 'og:type', content: 'website' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.mycarsbergamo.it' }],
})

const scrollProgress = ref(0)
const currentSlide = ref(0)
const transitioning = ref(false)
let slideInterval: any

onMounted(() => {
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight
    scrollProgress.value = (window.scrollY / total) * 100
  })
  slideInterval = setInterval(() => nextSlide(), 5000)
})

onUnmounted(() => {
  clearInterval(slideInterval)
})

const nextSlide = () => {
  transitioning.value = true
  setTimeout(() => {
    currentSlide.value = (currentSlide.value + 1) % 3
    transitioning.value = false
  }, 300)
}

const prevSlide = () => {
  transitioning.value = true
  setTimeout(() => {
    currentSlide.value = (currentSlide.value - 1 + 3) % 3
    transitioning.value = false
  }, 300)
}

const goToSlide = (index: number) => {
  if (index === currentSlide.value) return
  transitioning.value = true
  setTimeout(() => {
    currentSlide.value = index
    transitioning.value = false
  }, 300)
}
</script>

<template>
  <div class="text-white relative">
    <div class="fixed top-0 left-0 h-1 bg-[#A30000] z-50 transition-all duration-300" :style="{ width: scrollProgress + '%' }" />

    <!-- HERO -->
    <section class="relative w-full min-h-screen flex items-center justify-center text-center group overflow-hidden">
      <video 
        autoplay 
        muted 
        loop 
        playsinline 
        preload="auto" 
        class="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/public/static/images/def-2.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-black/60 z-0 transition duration-500 group-hover:bg-black/70" />
      <div class="relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div class="space-y-4 sm:space-y-6 lg:space-y-8 transform transition duration-700 group-hover:scale-105">
          <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-wide animate-fadeInDown leading-tight">
            {{ $t('homepage.heroTitle') }}
          </h1>
          <p class="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 animate-fadeIn max-w-2xl mx-auto leading-relaxed">
            {{ $t('homepage.heroSubtitle') }}
          </p>
          <div class="pt-2 sm:pt-4">
            <NuxtLink
              to="/chisiamo"
              class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base"
            >
              {{ $t('homepage.discoverMore') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- SEZIONI -->
    <section
      v-for="(section, idx) in 4"
      :key="idx"
      class="relative w-full min-h-screen flex items-center justify-center text-center group overflow-hidden"
    >
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
        :style="`background-image: url('/static/images/${idx + 2}.jpg')`" 
      />
      <div class="absolute inset-0 bg-black/40 transition duration-500 group-hover:bg-black/50" />
      <div class="relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div class="space-y-4 sm:space-y-6 transform transition-all duration-700 group-hover:scale-105">
          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#A30000] animate-fadeInDown leading-tight">
            {{ $t(`homepage.sections[${idx}].title`) }}
          </h2>
          <p class="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 animate-fadeIn max-w-2xl mx-auto leading-relaxed">
            {{ $t(`homepage.sections[${idx}].text`) }}
          </p>
          <div class="pt-2 sm:pt-4">
            <NuxtLink
              :to="['/usato', '/noleggio', '/servizi', '/contatti'][idx]"
              class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 transform text-sm sm:text-base"
            >
              {{ $t('homepage.discoverMore') }} →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIANZE -->
    <section class="py-12 sm:py-16 lg:py-20 text-white bg-black text-center">
      <div class="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#A30000] mb-8 sm:mb-12 lg:mb-16">
          {{ $t('homepage.testimonialsTitle') }}
        </h2>
        
        <div class="max-w-4xl mx-auto relative">
          <div class="bg-[#111] rounded-xl shadow-2xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#A30000]/20 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
            <div class="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#A30000]/10 to-transparent rounded-full translate-x-16 translate-y-16"></div>
            
            <transition name="fade">
              <div v-if="!transitioning" key="slide" class="relative z-10">
                <div class="text-[#A30000] text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">"</div>
                <p class="text-base sm:text-lg lg:text-xl italic leading-relaxed mb-6 sm:mb-8">
                  "{{ $t(`homepage.testimonials[${currentSlide}].text`) }}"
                </p>
                <p class="font-semibold text-[#A30000] text-lg sm:text-xl">
                  — {{ $t(`homepage.testimonials[${currentSlide}].name`) }}
                </p>
              </div>
            </transition>

            <!-- Navigation arrows (hidden on mobile) -->
            <button 
              @click="prevSlide" 
              class="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 text-white hover:text-[#A30000] text-2xl sm:text-3xl p-2 transition-all duration-300 hover:scale-110 hidden sm:block"
            >
              ‹
            </button>
            <button 
              @click="nextSlide" 
              class="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 text-white hover:text-[#A30000] text-2xl sm:text-3xl p-2 transition-all duration-300 hover:scale-110 hidden sm:block"
            >
              ›
            </button>
          </div>
          
          <!-- Indicators -->
          <div class="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4">
            <button
              v-for="(_, i) in 3"
              :key="i"
              class="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300"
              :class="currentSlide === i ? 'bg-[#A30000] border-[#A30000] scale-110' : 'bg-white/20 border-white/30 hover:border-[#A30000]/50'"
              @click="goToSlide(i)"
            />
          </div>
          
          <!-- Mobile navigation -->
          <div class="flex justify-center gap-6 mt-6 sm:hidden">
            <button 
              @click="prevSlide" 
              class="text-white hover:text-[#A30000] text-2xl p-2 transition-all duration-300"
            >
              ‹
            </button>
            <button 
              @click="nextSlide" 
              class="text-white hover:text-[#A30000] text-2xl p-2 transition-all duration-300"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 1s ease-out both;
}
.animate-fadeInDown {
  animation: fadeInDown 1s ease-out both;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
