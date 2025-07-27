<script setup lang="ts">
import { useHead, useI18n } from '#imports'

const { t, locale } = useI18n()

useHead({
  title: t('cookie.meta.title'),
  meta: [
    { name: 'description', content: t('cookie.meta.description') },
    { name: 'keywords', content: t('cookie.meta.keywords') },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: t('cookie.meta.ogTitle') },
    { property: 'og:description', content: t('cookie.meta.ogDescription') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/cookie-policy' },
    { property: 'og:locale', content: locale.value === 'it' ? 'it_IT' : 'en_GB' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/cookie-policy' }
  ]
})
</script>

<template>
  <main>
    <section class="w-full bg-black text-white py-16 px-4 md:px-10 pb-40" aria-labelledby="cookie-title">
      <article class="max-w-4xl mx-auto space-y-8">
        <h1 id="cookie-title" class="text-4xl font-bold text-white">
          {{ t('cookie.title') }}
        </h1>

        <p class="text-white/90">{{ t('cookie.intro') }}</p>

        <h2 class="text-2xl font-semibold text-white">{{ t('cookie.sections.cosaSono.title') }}</h2>
        <p class="text-white/80">{{ t('cookie.sections.cosaSono.content') }}</p>

        <h2 class="text-2xl font-semibold text-white">{{ t('cookie.sections.tipologie.title') }}</h2>
        <p class="text-white/80">{{ t('cookie.sections.tipologie.content') }}</p>
        <p class="text-white/80">{{ t('cookie.sections.tipologie.paragraph') }}</p>

        <h2 class="text-2xl font-semibold text-white">{{ t('cookie.sections.gestione.title') }}</h2>
        <p class="text-white/80">{{ t('cookie.sections.gestione.content') }}</p>

        <h2 class="text-2xl font-semibold text-white">{{ t('cookie.sections.consenso.title') }}</h2>
        <p class="text-white/80">{{ t('cookie.sections.consenso.content') }}</p>

        <p class="text-sm text-white/60 pt-6">{{ t('cookie.lastUpdate') }}</p>
      </article>
    </section>
  </main>
</template>
