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
    <section class="w-full bg-black text-white py-16 px-4 md:px-10 pb-40" aria-labelledby="privacy-title">
      <article class="max-w-4xl mx-auto space-y-8">
        <h1 id="privacy-title" class="text-4xl font-bold text-white">
          Privacy Policy
        </h1>

        <p class="text-white/90">
          Questa informativa sulla privacy descrive le modalità con cui raccogliamo, utilizziamo e proteggiamo i tuoi dati personali quando utilizzi il nostro sito.
        </p>

        <h2 class="text-2xl font-semibold text-white">Titolare del trattamento</h2>
        <p class="text-white/80">
          Il titolare del trattamento dei dati è MyCars, con sede in Via dei Livelli di Sopra, 24060 Costa di Mezzate (BG). Puoi contattarci via email all’indirizzo email.
        </p>

        <h2 class="text-2xl font-semibold text-white">Dati raccolti</h2>
        <p class="text-white/80">Raccogliamo dati anagrafici come nome e cognome.</p>
        <p class="text-white/80">Raccogliamo dati di contatto come email e numero di telefono.</p>
        <p class="text-white/80">Raccogliamo dati forniti volontariamente attraverso i moduli presenti sul sito.</p>
        <p class="text-white/80">Raccogliamo anche dati di navigazione anonimi, come indirizzo IP e tipo di browser utilizzato.</p>

        <h2 class="text-2xl font-semibold text-white">Finalità del trattamento</h2>
        <p class="text-white/80">I dati raccolti vengono utilizzati per gestire le richieste di contatto.</p>
        <p class="text-white/80">Previo consenso, possiamo utilizzarli per inviare comunicazioni promozionali.</p>
        <p class="text-white/80">Utilizziamo i dati anche per migliorare il nostro sito e i servizi offerti.</p>

        <h2 class="text-2xl font-semibold text-white">Conservazione dei dati</h2>
        <p class="text-white/80">
          I dati personali saranno conservati per il tempo necessario a soddisfare le finalità per cui sono stati raccolti o secondo quanto previsto dalla normativa vigente.
        </p>

        <h2 class="text-2xl font-semibold text-white">Diritti dell’utente</h2>
        <p class="text-white/80">
          Hai il diritto di accedere, modificare, cancellare o opporti al trattamento dei tuoi dati personali. Per esercitare questi diritti puoi scriverci all'indirizzo email.
        </p>

        <h2 class="text-2xl font-semibold text-white">Sicurezza</h2>
        <p class="text-white/80">
          Adottiamo misure tecniche e organizzative adeguate per garantire la sicurezza dei dati personali, evitando accessi non autorizzati, perdita o divulgazione indebita.
        </p>

        <h2 class="text-2xl font-semibold text-white">Modifiche</h2>
        <p class="text-white/80">
          La presente informativa può essere soggetta a modifiche. Eventuali aggiornamenti saranno pubblicati su questa pagina.
        </p>

        <p class="text-sm text-white/60 pt-6">
          Ultimo aggiornamento: giugno 2025
        </p>
      </article>
    </section>
  </main>
</template>
