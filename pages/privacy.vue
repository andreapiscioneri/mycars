<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Privacy Policy | MyCars Bergamo',
  meta: [
    {
      name: 'description',
      content: 'Leggi la nostra Privacy Policy per sapere come trattiamo i tuoi dati personali in conformità al GDPR e alle normative vigenti.'
    },
    {
      name: 'keywords',
      content: 'privacy policy, trattamento dati, dati personali, GDPR, sicurezza'
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Privacy Policy | MyCars Bergamo' },
    { property: 'og:description', content: 'Scopri come proteggiamo i tuoi dati personali e quali diritti hai secondo il GDPR.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/privacy-policy' },
    { property: 'og:locale', content: 'it_IT' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/privacy-policy' }
  ]
})
</script>

<template>
  <main>
    <section
      class="w-full bg-black text-white py-16 px-4 md:px-10 pb-40"
      aria-labelledby="privacy-title"
    >
      <article class="max-w-4xl mx-auto space-y-8">
        <h1 id="privacy-title" class="text-4xl font-bold text-white">
          Privacy Policy
        </h1>

        <p class="text-white/90">
          Questa informativa sulla privacy descrive le modalità con cui raccogliamo, utilizziamo e proteggiamo i tuoi dati personali quando utilizzi il nostro sito.
        </p>

        <h2 class="text-2xl font-semibold text-white">Titolare del trattamento</h2>
        <p class="text-white/80">
          Il titolare del trattamento dei dati è <strong>MyCars</strong>, con sede in Via dei Livelli di Sopra, 24060 Costa di Mezzate (BG).
          Puoi contattarci via email all’indirizzo <a href="mailto:info@maycars.it" class="underline">info@maycars.it</a>.
        </p>

        <h2 class="text-2xl font-semibold text-white">Dati raccolti</h2>
        <ul class="list-disc list-inside text-white/80 space-y-2">
          <li>Dati anagrafici (nome, cognome)</li>
          <li>Contatti (email, telefono)</li>
          <li>Dati forniti volontariamente tramite form</li>
          <li>Dati di navigazione anonimi (IP, tipo di browser, ecc.)</li>
        </ul>

        <h2 class="text-2xl font-semibold text-white">Finalità del trattamento</h2>
        <p class="text-white/80">
          I dati raccolti vengono utilizzati per:
        </p>
        <ul class="list-disc list-inside text-white/80 space-y-2">
          <li>Gestione delle richieste di contatto</li>
          <li>Comunicazioni promozionali (previo consenso)</li>
          <li>Miglioramento del sito e dei servizi</li>
        </ul>

        <h2 class="text-2xl font-semibold text-white">Conservazione dei dati</h2>
        <p class="text-white/80">
          I dati saranno conservati per il tempo necessario a soddisfare le finalità indicate o secondo quanto previsto dalla legge.
        </p>

        <h2 class="text-2xl font-semibold text-white">Diritti dell’utente</h2>
        <p class="text-white/80">
          In qualsiasi momento hai il diritto di accedere, modificare, cancellare o opporti al trattamento dei tuoi dati personali.
          Puoi esercitare questi diritti scrivendo a <a href="mailto:info@maycars.it" class="underline">info@maycars.it</a>.
        </p>

        <h2 class="text-2xl font-semibold text-white">Sicurezza</h2>
        <p class="text-white/80">
          Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, perdita o distruzione.
        </p>

        <h2 class="text-2xl font-semibold text-white">Modifiche</h2>
        <p class="text-white/80">
          Questa informativa può essere aggiornata. Le modifiche saranno pubblicate su questa pagina.
        </p>

        <p class="text-sm text-white/60 pt-6">
          Ultimo aggiornamento: giugno 2025
        </p>
      </article>
    </section>
  </main>
</template>
