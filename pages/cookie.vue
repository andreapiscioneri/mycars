<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Cookie Policy | MyCars Bergamo',
  meta: [
    {
      name: 'description',
      content: 'Leggi la nostra Cookie Policy per sapere come MyCars utilizza i cookie sul sito web e come puoi gestirli nel tuo browser.'
    },
    {
      name: 'keywords',
      content: 'cookie policy, gestione cookie, privacy, dati personali, tracciamento'
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Cookie Policy | MyCars Bergamo' },
    { property: 'og:description', content: 'Scopri quali cookie utilizziamo e come gestirli.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/cookie-policy' },
    { property: 'og:locale', content: 'it_IT' }
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
          Cookie Policy
        </h1>

        <p class="text-white/90">
          Questa Cookie Policy spiega cosa sono i cookie, come li utilizziamo e come puoi gestirli. Continuando a navigare su questo sito, acconsenti all'uso dei cookie secondo quanto descritto qui di seguito.
        </p>

        <h2 class="text-2xl font-semibold text-white">Cosa sono i cookie?</h2>
        <p class="text-white/80">
          I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Servono a migliorare l’esperienza di navigazione, ricordando le tue preferenze e raccogliendo informazioni anonime sull’uso del sito.
        </p>

        <h2 class="text-2xl font-semibold text-white">Tipologie di cookie utilizzati</h2>
        <ul class="list-disc list-inside text-white/80 space-y-2">
          <li>Cookie tecnici: necessari per il corretto funzionamento del sito.</li>
          <li>Cookie analitici: utilizzati per raccogliere informazioni anonime sul comportamento degli utenti.</li>
          <li>Cookie di terze parti: ad esempio da Google Analytics, per finalità statistiche e di marketing.</li>
        </ul>

        <h2 class="text-2xl font-semibold text-white">Gestione dei cookie</h2>
        <p class="text-white/80">
          Puoi modificare le impostazioni del tuo browser per accettare o rifiutare i cookie. Disattivare i cookie potrebbe influenzare l'esperienza di navigazione.
        </p>

        <h2 class="text-2xl font-semibold text-white">Consenso</h2>
        <p class="text-white/80">
          Continuando a utilizzare questo sito senza modificare le impostazioni del browser, acconsenti all’uso dei cookie secondo quanto indicato nella presente policy.
        </p>

        <p class="text-sm text-white/60 pt-6">
          Ultimo aggiornamento: giugno 2025
        </p>
      </article>
    </section>
  </main>
</template>
