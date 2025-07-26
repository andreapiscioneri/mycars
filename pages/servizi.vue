<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: t('servizi.meta.title'),
  meta: [
    {
      name: 'description',
      content: t('servizi.meta.description')
    },
    {
      name: 'keywords',
      content: t('servizi.meta.keywords')
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: t('servizi.meta.title') },
    {
      property: 'og:description',
      content: t('servizi.meta.ogDescription')
    },
    { property: 'og:image', content: 'https://www.mycarsbergamo.it/static/images/12.jpg' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/servizi' },
    { property: 'og:type', content: 'website' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.mycarsbergamo.it/servizi' }],
})
</script>

<template>
  <section class="w-full bg-black text-white">
    <!-- Hero -->
    <div
      class="h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center relative"
      style="background-image: url('/static/images/12.jpg')"
    >
      <div class="absolute inset-0 bg-opacity-60 bg-black" />
      <h1 class="relative text-4xl md:text-5xl font-extrabold text-white text-center">
        {{ t('servizi.title') }}
      </h1>
    </div>

    <!-- Contenuto -->
    <div class="max-w-6xl mx-auto pt-12 pb-40 px-4 space-y-20">
      <!-- Blocco 1 -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">{{ t('servizi.blocchi.0.titolo') }}</h2>
          <p class="text-white/90">{{ t('servizi.blocchi.0.testo') }}</p>
        </div>
        <img
          src="/static/images/10.jpg"
          alt="Vendita auto usate e noleggio"
          class="rounded-lg shadow-xl w-full object-cover"
        />
      </div>

      <!-- Blocco 2 -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/static/images/14.jpg"
          alt="Consulenza personalizzata"
          class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
        />
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">{{ t('servizi.blocchi.1.titolo') }}</h2>
          <p class="text-white/90">{{ t('servizi.blocchi.1.testo') }}</p>
        </div>
      </div>

      <!-- Blocco 3 -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">{{ t('servizi.blocchi.2.titolo') }}</h2>
          <p class="text-white/90">{{ t('servizi.blocchi.2.testo') }}</p>
        </div>
        <img
          src="/static/images/13.jpg"
          alt="Permuta auto"
          class="rounded-lg shadow-xl w-full object-cover"
        />
      </div>

      <!-- Blocco 4 -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/static/images/11.jpg"
          alt="Assistenza post vendita"
          class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
        />
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">{{ t('servizi.blocchi.3.titolo') }}</h2>
          <p class="text-white/90">{{ t('servizi.blocchi.3.testo') }}</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="flex justify-center pt-10">
        <NuxtLink
          to="/contatti"
          class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-semibold px-6 py-3 rounded shadow-md transition"
        >
          {{ t('servizi.cta') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
