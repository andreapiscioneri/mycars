<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ItemsList from '@/components/itemsList.vue'

// SEO con useHead (auto-importato in Nuxt 3)
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

const sections = [
  {
    title: 'Gamma completa',
    text: 'Scopri la nostra selezione di veicoli nuovi e usati, accuratamente controllati per garantirti qualità e prestazioni.',
    image: '/static/images/5.jpg',
    link: '/usato',
  },
  {
    title: 'Design e Tecnologia',
    text: 'Veicoli con stile, carattere e tecnologia d’avanguardia. Vieni a provarli.',
    image: '/static/images/2.jpg',
    link: '/noleggio',
  },
  {
    title: 'Servizi Post-Vendita',
    text: 'Officina autorizzata, assistenza clienti e ricambi sempre disponibili.',
    image: '/static/images/3.jpg',
    link: '/servizi',
  },
  {
    title: 'Finanziamenti Personalizzati',
    text: 'Tante soluzioni flessibili pensate per ogni esigenza di acquisto.',
    image: '/static/images/4.jpg',
    link: '/contatti',
  },
]

const scrollProgress = ref(0)
const currentSlide = ref(0)
const transitioning = ref(false)
let slideInterval: any

const testimonianze = [
  { nome: 'Marco B.', testo: 'Servizio impeccabile e auto perfetta. Consigliatissimi!' },
  { nome: 'Laura V.', testo: 'Ampia scelta e personale super disponibile. Un’esperienza ottima!' },
  { nome: 'Giorgio T.', testo: 'Ho acquistato un usato garantito, come nuovo! Fantastici.' },
]

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
    currentSlide.value = (currentSlide.value + 1) % testimonianze.length
    transitioning.value = false
  }, 300)
}

const prevSlide = () => {
  transitioning.value = true
  setTimeout(() => {
    currentSlide.value = (currentSlide.value - 1 + testimonianze.length) % testimonianze.length
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
    <div v-if="false" class="testLocale">
      {{ $t('test') }}
    </div>
    <!-- Scroll bar -->
    <div class="fixed top-0 left-0 h-1 bg-[#A30000] z-50 transition-all duration-300" :style="{ width: scrollProgress + '%' }" />

    <ItemsList />

    <!-- HERO -->
    <section class="relative w-full min-h-[90vh] md:h-screen flex items-center justify-center text-center group overflow-hidden px-4">
      <video autoplay muted loop playsinline preload="auto" class="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/public/static/images/def-2.mp4" type="video/mp4" />
        Il tuo browser non supporta il video HTML5.
      </video>
      <div class="absolute inset-0 bg-[#000000a1] bg-opacity-50 z-0 transition duration-500 group-hover:bg-opacity-60" />
      <div class="relative z-10 space-y-6 transform transition duration-700 group-hover:scale-105 max-w-2xl">
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wide animate-fadeInDown">
          MyCars - La tua auto, il tuo stile
        </h1>
        <p class="text-base sm:text-lg text-white/80 animate-fadeIn">
          Qualità, passione e servizi su misura. Scopri il tuo prossimo veicolo.
        </p>
        <NuxtLink
          to="/chisiamo"
          class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-light px-6 py-3 rounded shadow-md transition transform hover:scale-105 hover:shadow-lg"
        >
          Scopri di più
        </NuxtLink>
      </div>
    </section>

    <!-- SEZIONI -->
    <section
      v-for="(section, idx) in sections"
      :key="idx"
      class="relative w-full min-h-[90vh] md:h-screen flex items-center justify-center text-center group overflow-hidden px-4"
    >
      <div class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
           :style="`background-image: url('${section.image}')`" />
      <div class="absolute inset-0 bg-black/30 transition duration-500 group-hover:bg-opacity-40" />
      <div class="relative z-10 px-4 max-w-2xl space-y-5 transform transition-all duration-700 group-hover:scale-105">
        <h2 class="text-3xl sm:text-4xl font-bold text-[#A30000] animate-fadeInDown">
          {{ section.title }}
        </h2>
        <p class="text-sm sm:text-base md:text-lg text-white/90 animate-fadeIn">
          {{ section.text }}
        </p>
        <NuxtLink
          :to="section.link"
          class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-light px-6 py-2 rounded shadow transition hover:shadow-lg hover:scale-105 transform"
        >
          Scopri di più →
        </NuxtLink>
      </div>
    </section>

    <!-- TESTIMONIANZE -->
    <section class="py-20 text-white bg-black text-center space-y-10 px-4 sm:px-6">
      <h2 class="text-3xl sm:text-4xl font-bold text-[#A30000]">Cosa dicono i nostri clienti</h2>
      <div class="max-w-xl mx-auto relative bg-[#111] rounded-lg shadow-lg p-6 sm:p-8">
        <transition name="fade">
          <div v-if="!transitioning" key="slide" class="transition-opacity duration-300">
            <p class="text-base sm:text-lg italic">"{{ testimonianze[currentSlide].testo }}"</p>
            <p class="mt-4 font-semibold text-[#A30000]">- {{ testimonianze[currentSlide].nome }}</p>
          </div>
        </transition>

        <!-- Frecce -->
        <button @click="prevSlide" class="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full text-white hover:text-[#A30000] text-2xl px-3 hidden sm:block">‹</button>
        <button @click="nextSlide" class="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full text-white hover:text-[#A30000] text-2xl px-3 hidden sm:block">›</button>

        <!-- Indicatori -->
        <div class="mt-6 flex justify-center gap-3">
          <button
            v-for="(t, i) in testimonianze"
            :key="i"
            class="w-3 h-3 rounded-full border"
            :class="currentSlide === i ? 'bg-[#A30000] border-[#A30000]' : 'bg-white/20 border-white/30'"
            @click="goToSlide(i)"
          />
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

.testLocale {
  color: red;
}
</style>
