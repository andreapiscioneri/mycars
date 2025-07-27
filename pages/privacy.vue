<script setup lang="ts">
import { useHead, useI18n } from '#imports'

const { t, locale } = useI18n()

useHead({
  title: t('privacy.meta.title'),
  meta: [
    { name: 'description', content: t('privacy.meta.description') },
    { name: 'keywords', content: t('privacy.meta.keywords') },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: t('privacy.meta.ogTitle') },
    { property: 'og:description', content: t('privacy.meta.ogDescription') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/privacy-policy' },
    { property: 'og:locale', content: locale.value === 'it' ? 'it_IT' : 'en_GB' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/privacy-policy' }
  ]
})
</script>

<template>
  <main>
    <section class="w-full bg-black text-white py-16 px-4 md:px-10 pb-40" aria-labelledby="privacy-title">
      <article class="max-w-4xl mx-auto space-y-8">
        <h1 id="privacy-title" class="text-4xl font-bold text-white">
          {{ t('privacy.title') }}
        </h1>

        <p class="text-white/90">{{ t('privacy.intro') }}</p>

        <h2 class="text-2xl font-semibold text-white">{{ t('privacy.sections.finalita.title') }}</h2>
        <p class="text-white/80">{{ t('privacy.sections.finalita.content') }}</p>

        <h2 class="text-2xl font-semibold text-white">{{ t('privacy.sections.trattamento.title') }}</h2>
        <p class="text-white/80">{{ t('privacy.sections.trattamento.content') }}</p>

        <h2 class="text-2xl font-semibold text-white">{{ t('privacy.sections.diritti.title') }}</h2>
        <p class="text-white/80">{{ t('privacy.sections.diritti.content') }}</p>

        <h2 class="text-2xl font-semibold text-white">{{ t('privacy.sections.conservazione.title') }}</h2>
        <p class="text-white/80">{{ t('privacy.sections.conservazione.content') }}</p>

        <p class="text-sm text-white/60 pt-6">{{ t('privacy.lastUpdate') }}</p>
      </article>
    </section>
  </main>
</template>
