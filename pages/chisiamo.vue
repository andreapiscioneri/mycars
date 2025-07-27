<script setup>
import { useI18n } from 'vue-i18n'
import { useHead } from '#imports'

const { t } = useI18n()

useHead({
  title: t('chisiamo.meta.title'),
  meta: [
    { name: 'description', content: t('chisiamo.meta.description') },
    { name: 'keywords', content: t('chisiamo.meta.keywords') },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: t('chisiamo.meta.ogTitle') },
    { property: 'og:description', content: t('chisiamo.meta.ogDescription') },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/chi-siamo' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://www.mycarsbergamo.it/og-chi-siamo.jpg' }
  ],
  link: [{ rel: 'canonical', href: 'https://www.mycarsbergamo.it/chi-siamo' }]
})
</script>

<template>
  <main class="w-full bg-black text-white">
    <!-- Hero -->
    <section
      aria-labelledby="hero-title"
      class="h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-cover bg-center bg-no-repeat flex items-center justify-center relative overflow-hidden"
      style="background-image: url('/static/images/7.jpg')"
    >
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 id="hero-title" class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          {{ t('chisiamo.title') }}
        </h1>
        <p class="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
          La nostra passione per l'automotive al vostro servizio
        </p>
      </div>
    </section>

    <!-- Contenuto principale -->
    <article class="max-w-7xl mx-auto pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-32 lg:pb-40 px-4 sm:px-6 lg:px-8">
      <div class="space-y-16 sm:space-y-20 lg:space-y-24">
        <!-- Blocco 1 -->
        <section aria-labelledby="mission-title" class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div class="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <h2 id="mission-title" class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#A30000] leading-tight">
              {{ t('chisiamo.blocchi.0.titolo') }}
            </h2>
            <div class="space-y-4 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
              <p>{{ t('chisiamo.blocchi.0.testo1') }}</p>
              <p>{{ t('chisiamo.blocchi.0.testo2') }}</p>
            </div>
          </div>
          <figure class="order-1 lg:order-2">
            <img
              src="/static/images/8.jpg"
              alt="Team MyCars"
              class="rounded-xl shadow-2xl w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            <figcaption class="sr-only">{{ t('chisiamo.blocchi.0.figcaption') }}</figcaption>
          </figure>
        </section>

        <!-- Blocco 2 -->
        <section aria-labelledby="priority-title" class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <figure class="order-1">
            <img
              src="/static/images/9.jpg"
              alt="Consulente con cliente"
              class="rounded-xl shadow-2xl w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            <figcaption class="sr-only">{{ t('chisiamo.blocchi.1.figcaption') }}</figcaption>
          </figure>

          <div class="space-y-4 sm:space-y-6 order-2">
            <h2 id="priority-title" class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#A30000] leading-tight">
              {{ t('chisiamo.blocchi.1.titolo') }}
            </h2>
            <div class="space-y-4 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
              <p>{{ t('chisiamo.blocchi.1.testo1') }}</p>
              <p>{{ t('chisiamo.blocchi.1.testo2') }}</p>
            </div>
            <div class="pt-2 sm:pt-4">
              <NuxtLink
                to="/contatti"
                class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                {{ t('chisiamo.cta') }}
              </NuxtLink>
            </div>
          </div>
        </section>

        <!-- Sezione valori aggiuntiva -->
        <section class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/10">
          <div class="text-center mb-8 sm:mb-12">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">I Nostri Valori</h2>
            <p class="text-white/80 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
              Ciò che ci distingue nel settore automotive
            </p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div class="text-center space-y-3 sm:space-y-4">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#A30000]/20 rounded-full flex items-center justify-center mx-auto">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white">Qualità Garantita</h3>
              <p class="text-sm sm:text-base text-white/80">Veicoli accuratamente selezionati e controllati</p>
            </div>
            
            <div class="text-center space-y-3 sm:space-y-4">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#A30000]/20 rounded-full flex items-center justify-center mx-auto">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white">Prezzi Trasparenti</h3>
              <p class="text-sm sm:text-base text-white/80">Nessun costo nascosto, massima chiarezza</p>
            </div>
            
            <div class="text-center space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#A30000]/20 rounded-full flex items-center justify-center mx-auto">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white">Assistenza Completa</h3>
              <p class="text-sm sm:text-base text-white/80">Supporto costante prima, durante e dopo l'acquisto</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  </main>
</template>
