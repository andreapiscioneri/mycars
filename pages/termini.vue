<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Termini e Condizioni | MyCars Bergamo',
  meta: [
    {
      name: 'description',
      content:
        'Consulta i Termini e Condizioni di utilizzo del sito MyCars. Scopri le regole di navigazione, le responsabilità e i diritti legali degli utenti.'
    },
    {
      name: 'keywords',
      content:
        'termini e condizioni, condizioni d’uso, regolamento sito, MyCars, responsabilità legale, legge italiana'
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Termini e Condizioni | MyCars Bergamo' },
    {
      property: 'og:description',
      content: 'Leggi i Termini e Condizioni di utilizzo del sito MyCars, regolati dalla legge italiana.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/termini-e-condizioni' },
    { property: 'og:locale', content: 'it_IT' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/termini-e-condizioni' }
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
          Termini e Condizioni
        </h1>

        <p class="text-white/90">
          I presenti Termini e Condizioni regolano l’accesso e l’utilizzo del sito web di MyCars.
          Utilizzando il sito, accetti integralmente questi termini. In caso contrario, ti invitiamo a non utilizzare i nostri servizi.
        </p>

        <h2 class="text-2xl font-semibold text-white">1. Utilizzo del sito</h2>
        <p class="text-white/80">
          Il sito è destinato a un uso personale e non commerciale. È vietata qualsiasi attività che possa danneggiare o compromettere il funzionamento del sito o interferire con l’accesso di altri utenti.
        </p>

        <h2 class="text-2xl font-semibold text-white">2. Proprietà intellettuale</h2>
        <p class="text-white/80">
          Tutti i contenuti presenti sul sito, inclusi testi, immagini, loghi e marchi, sono di proprietà di MyCars o concessi in licenza. Ne è vietata la riproduzione, distribuzione o modifica senza autorizzazione scritta.
        </p>

        <h2 class="text-2xl font-semibold text-white">3. Limitazioni di responsabilità</h2>
        <p class="text-white/80">
          Pur impegnandoci a fornire informazioni accurate e aggiornate, non garantiamo che il sito sia privo di errori, virus o interruzioni. L’uso delle informazioni è a rischio dell’utente.
        </p>

        <h2 class="text-2xl font-semibold text-white">4. Collegamenti esterni</h2>
        <p class="text-white/80">
          Il sito può contenere link a siti di terze parti. MyCars non è responsabile per i contenuti, le politiche o le pratiche di tali siti.
        </p>

        <h2 class="text-2xl font-semibold text-white">5. Modifiche ai termini</h2>
        <p class="text-white/80">
          Ci riserviamo il diritto di modificare i presenti termini in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina e avranno effetto immediato.
        </p>

        <h2 class="text-2xl font-semibold text-white">6. Legge applicabile</h2>
        <p class="text-white/80">
          I presenti Termini e Condizioni sono regolati dalla legge italiana. In caso di controversie sarà competente il foro di Bergamo.
        </p>

        <p class="text-sm text-white/60 pt-6">
          Ultimo aggiornamento: giugno 2025
        </p>
      </article>
    </section>
  </main>
</template>
