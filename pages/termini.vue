<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: t('termini.meta.title'),
  meta: [
    {
      name: 'description',
      content: t('termini.meta.description')
    },
    {
      name: 'keywords',
      content: t('termini.meta.keywords')
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: t('termini.meta.ogTitle') },
    {
      property: 'og:description',
      content: t('termini.meta.ogDescription')
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: t('termini.meta.canonical') },
    { property: 'og:locale', content: 'it_IT' }
  ],
  link: [
    { rel: 'canonical', href: t('termini.meta.canonical') }
  ]
})
</script>

<template>
  <main>
    <section
      class="w-full bg-black text-white py-16 px-4 md:px-10 pb-40"
      aria-labelledby="terms-title"
    >
      <article class="max-w-4xl mx-auto space-y-8">
        <h1 id="terms-title" class="text-4xl font-bold text-white">
          {{ t('termini.title') }}
        </h1>

        <p class="text-white/90">
          {{ t('termini.intro') }}
        </p>

        <h2 class="text-2xl font-semibold text-white">{{ t('termini.sections.utilizzo.title') }}</h2>
        <p class="text-white/80">
          {{ t('termini.sections.utilizzo.content') }}
        </p>

        <h2 class="text-2xl font-semibold text-white">{{ t('termini.sections.proprieta.title') }}</h2>
        <p class="text-white/80">
          {{ t('termini.sections.proprieta.content') }}
        </p>

        <h2 class="text-2xl font-semibold text-white">{{ t('termini.sections.limitazioni.title') }}</h2>
        <p class="text-white/80">
          {{ t('termini.sections.limitazioni.content') }}
        </p>

        <h2 class="text-2xl font-semibold text-white">{{ t('termini.sections.collegamenti.title') }}</h2>
        <p class="text-white/80">
          {{ t('termini.sections.collegamenti.content') }}
        </p>

        <h2 class="text-2xl font-semibold text-white">{{ t('termini.sections.modifiche.title') }}</h2>
        <p class="text-white/80">
          {{ t('termini.sections.modifiche.content') }}
        </p>

        <h2 class="text-2xl font-semibold text-white">{{ t('termini.sections.legge.title') }}</h2>
        <p class="text-white/80">
          {{ t('termini.sections.legge.content') }}
        </p>

        <p class="text-sm text-white/60 pt-6">
          {{ t('termini.lastUpdate') }}
        </p>
      </article>
    </section>
  </main>
</template>
