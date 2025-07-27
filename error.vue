<script setup lang="ts">
import { useI18n } from '#imports'

defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const { t } = useI18n()
</script>

<template>
  <section class="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
    <div class="text-center space-y-8 max-w-2xl">
      <h1 class="text-[100px] md:text-[160px] font-extrabold leading-none text-[#A30000] drop-shadow-lg">
        {{ error.statusCode || t('errorPage.fallbackTitle') }}
      </h1>
      <h2 class="text-3xl md:text-4xl font-semibold">
        {{ t('errorPage.heading') }}
      </h2>
      <p class="text-white/80 text-lg">
        {{ t('errorPage.description') }}
      </p>

      <NuxtLink to="/">
        <button class="cursor-pointer bg-[#A30000] hover:bg-red-700 transition px-8 py-4 rounded text-base font-light shadow-md hover:shadow-lg">
          {{ t('errorPage.backButton') }}
        </button>
      </NuxtLink>
    </div>
  </section>
</template>
