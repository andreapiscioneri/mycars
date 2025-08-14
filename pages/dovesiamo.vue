<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHead } from '#imports'

const { t } = useI18n()

const mezzateMapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.139195481139!2d9.774582312863232!3d45.66274542066452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47814d4ea629b88d%3A0x5949ed7e5b6e4724!2sVia%20dei%20Livelli%20di%20Sopra%2C%2024060%20Costa%20di%20Mezzate%20BG!5e0!3m2!1sit!2sit!4v1749632701234!5m2!1sit!2sit"

useHead({
  title: t('dovesiamo.meta.title'),
  meta: [
    { name: 'description', content: t('dovesiamo.meta.description') },
    { name: 'keywords', content: t('dovesiamo.meta.keywords') },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: t('dovesiamo.meta.ogTitle') },
    { property: 'og:description', content: t('dovesiamo.meta.ogDescription') },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/contatti/costa-di-mezzate' },
    { property: 'og:type', content: 'business.business' },
    { property: 'og:locale', content: 'it_IT' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/contatti/costa-di-mezzate' }
  ]
})
</script>

<template>
  <main>
    <section
      class="w-full px-4 md:px-10 py-16 bg-black text-white pb-40"
      aria-labelledby="contatti-title"
    >
      <div class="w-full max-w-none grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
        <!-- Info contatto -->
        <div class="p-6 md:p-12">
          <h1 id="contatti-title" class="text-3xl font-extrabold text-[#A30000] mb-4">
            {{ t('dovesiamo.title') }}
          </h1>

          <address class="not-italic text-base font-medium leading-relaxed">
            <p>{{ t('dovesiamo.indirizzo') }}</p>
          </address>

          <!-- Telefono -->
          <p class="text-base flex items-center gap-2 mt-4">
            <a href="tel:+39035319414" class="hover:underline text-white" aria-label="Telefono MyCars">
              +39 035 319414
            </a>
            <img
              src="/static/images/telefono.png"
              alt="Icona telefono MyCars"
              class="w-4 h-4"
              loading="lazy"
            />
          </p>

          <!-- Email -->
          <p class="text-base flex items-center gap-2 mt-2">
            <a href="mailto:info@maycars.it" class="hover:underline text-white" aria-label="Email MyCars">
              info@maycars.it
            </a>
            <img
              src="/static/images/mailblack.png"
              alt="Icona email MyCars"
              class="w-4 h-3"
              loading="lazy"
            />
          </p>

          <!-- Orari -->
          <div class="mt-4 text-sm leading-relaxed" aria-label="Orari di apertura">
            <p><strong class="text-[#A30000]">{{ t('dovesiamo.orariTitolo') }}</strong></p>
            <ul class="mt-1 space-y-1">
              <li>{{ t('dovesiamo.orari.lunven') }}</li>
              <li>{{ t('dovesiamo.orari.sabato') }}</li>
              <li>{{ t('dovesiamo.orari.domenica') }}</li>
            </ul>
          </div>

          <div class="border-t-2 border-[#A30000] mt-6 w-full"></div>
        </div>

        <!-- Mappa -->
        <div class="w-full h-[350px] md:h-[500px]" aria-label="Mappa sede Costa di Mezzate">
          <iframe
            :src="mezzateMapSrc"
            width="100%"
            height="100%"
            style="border:0;"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="rounded-lg"
            title="Mappa MyCars Costa di Mezzate"
          ></iframe>
        </div>
      </div>
    </section>
  </main>
</template>
