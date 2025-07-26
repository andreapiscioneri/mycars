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
      class="h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center relative"
      style="background-image: url('/static/images/7.jpg')"
    >
      <div class="absolute inset-0 bg-opacity-60"></div>
      <h1 id="hero-title" class="relative text-4xl md:text-5xl font-extrabold text-white text-center">
        {{ t('chisiamo.title') }}
      </h1>
    </section>

    <!-- Contenuto principale -->
    <article class="max-w-6xl mx-auto pt-12 pb-40 px-4 space-y-20">
      <!-- Blocco 1 -->
      <section aria-labelledby="mission-title" class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 id="mission-title" class="text-3xl font-bold text-[#A30000]">
            {{ t('chisiamo.blocchi.0.titolo') }}
          </h2>
          <p>{{ t('chisiamo.blocchi.0.testo1') }}</p>
          <p>{{ t('chisiamo.blocchi.0.testo2') }}</p>
        </div>
        <figure>
          <img
            src="/static/images/8.jpg"
            alt="Team MyCars"
            class="rounded-lg shadow-xl w-full object-cover"
            loading="lazy"
          />
          <figcaption class="sr-only">{{ t('chisiamo.blocchi.0.figcaption') }}</figcaption>
        </figure>
      </section>

      <!-- Blocco 2 -->
      <section aria-labelledby="priority-title" class="grid md:grid-cols-2 gap-12 items-center">
        <figure>
          <img
            src="/static/images/9.jpg"
            alt="Consulente con cliente"
            class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
            loading="lazy"
          />
          <figcaption class="sr-only">{{ t('chisiamo.blocchi.1.figcaption') }}</figcaption>
        </figure>

        <div class="space-y-4">
          <h2 id="priority-title" class="text-3xl font-bold text-[#A30000]">
            {{ t('chisiamo.blocchi.1.titolo') }}
          </h2>
          <p>{{ t('chisiamo.blocchi.1.testo1') }}</p>
          <p>{{ t('chisiamo.blocchi.1.testo2') }}</p>
          <NuxtLink
            to="/contatti"
            class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-semibold px-6 py-3 rounded shadow-md transition"
          >
            {{ t('chisiamo.cta') }}
          </NuxtLink>
        </div>
      </section>
    </article>
  </main>
</template>
