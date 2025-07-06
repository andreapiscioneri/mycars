<script setup>
import { useHead } from '#imports'

useHead({
  title: 'Chi Siamo | MyCars Bergamo – Passione, Affidabilità e Servizio',
  meta: [
    {
      name: 'description',
      content:
        'MyCars Bergamo: passione per le auto, selezione veicoli di qualità, consulenze personalizzate e assistenza continua. Scopri la nostra storia.'
    },
    {
      name: 'keywords',
      content:
        'MyCars, concessionaria Bergamo, auto usate, noleggio auto, assistenza post vendita, chi siamo, showroom Bergamo'
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Chi Siamo | MyCars Bergamo' },
    {
      property: 'og:description',
      content: 'Passione, professionalità e trasparenza nel nostro showroom a Bergamo. Scopri MyCars e il nostro team.'
    },
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
        Chi siamo
      </h1>
    </section>

    <!-- Contenuto principale -->
    <article class="max-w-6xl mx-auto pt-12 pb-40 px-4 space-y-20">
      <!-- Sezione 1 -->
      <section aria-labelledby="mission-title" class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 id="mission-title" class="text-3xl font-bold text-[#A30000]">Passione per l'eccellenza</h2>
          <p>
            MyCars nasce dalla passione per le auto e dalla volontà di offrire ai clienti un servizio personalizzato,
            professionale e affidabile. La nostra missione è rendere l'acquisto e la vendita di veicoli un’esperienza
            semplice e soddisfacente, con trasparenza e competenza.
          </p>
          <p>
            Selezioniamo con cura ogni veicolo, garantendo qualità, sicurezza e un ottimo rapporto qualità-prezzo.
            Il nostro team è sempre a disposizione per trovare la soluzione perfetta per le tue esigenze.
          </p>
        </div>
        <figure>
          <img
            src="/static/images/8.jpg"
            alt="Team MyCars nel loro showroom"
            class="rounded-lg shadow-xl w-full object-cover"
            loading="lazy"
          />
          <figcaption class="sr-only">Team MyCars nello showroom</figcaption>
        </figure>
      </section>

      <!-- Sezione 2 -->
      <section aria-labelledby="priority-title" class="grid md:grid-cols-2 gap-12 items-center">
        <figure>
          <img
            src="/static/images/9.jpg"
            alt="Consulente MyCars con cliente"
            class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
            loading="lazy"
          />
          <figcaption class="sr-only">Consulenza personalizzata con un cliente</figcaption>
        </figure>

        <div class="space-y-4">
          <h2 id="priority-title" class="text-3xl font-bold text-[#A30000]">
            La tua soddisfazione è la nostra priorità
          </h2>
          <p>
            Con sedi strategiche e un’ampia rete di contatti nel settore automobilistico, offriamo consulenze
            personalizzate, valutazioni gratuite e un servizio post-vendita sempre presente.
          </p>
          <p>
            Vieni a trovarci per scoprire il nostro showroom o contattaci per un appuntamento. Ti guideremo nella scelta
            dell’auto giusta per te.
          </p>
          <NuxtLink
            to="/contatti"
            class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-semibold px-6 py-3 rounded shadow-md transition"
          >
            Contattaci
          </NuxtLink>
        </div>
      </section>
    </article>
  </main>
</template>
