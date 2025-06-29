<template>
  <section class="w-full bg-black text-white">
    <!-- Hero -->
    <div
      class="h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center relative"
      style="background-image: url('/static/images/7.jpg')"
    >
      <div class="absolute inset-0 bg-opacity-60"></div>
      <h1 class="relative text-4xl md:text-5xl font-extrabold text-[#A30000] text-center">
        Chi siamo
      </h1>
    </div>

    <!-- Contenuto -->
    <div class="max-w-6xl mx-auto pt-12 pb-40 px-4 space-y-20">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">Passione per l'eccellenza</h2>
          <p class="text-white/90">
            MyCars nasce dalla passione per le auto e dalla volontà di offrire ai clienti un servizio personalizzato, professionale e affidabile.
            La nostra missione è rendere l'acquisto e la vendita di veicoli un’esperienza semplice e soddisfacente, con trasparenza e competenza.
          </p>
          <p class="text-white/80">
            Selezioniamo con cura ogni veicolo, garantendo qualità, sicurezza e un ottimo rapporto qualità-prezzo.
            Il nostro team è sempre a disposizione per trovare la soluzione perfetta per le tue esigenze.
          </p>
        </div>
        <img src="/static/images/8.jpg" alt="Auto elegante" class="rounded-lg shadow-xl w-full object-cover" />
      </div>

<div class="grid md:grid-cols-2 gap-12 items-center">
  <!-- Immagine a sinistra -->
  <img
    src="/static/images/9.jpg"
    alt="Auto elegante"
    class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
  />

  <!-- Testo a destra -->
  <div class="space-y-4">
    <h2 class="text-3xl font-bold text-[#A30000]">
      La tua soddisfazione è la nostra priorità
    </h2>
    <p class="text-white/90">
      Con sedi strategiche e un’ampia rete di contatti nel settore automobilistico,
      offriamo consulenze personalizzate, valutazioni gratuite e un servizio post-vendita sempre presente.
    </p>
    <p class="text-white/80">
      Vieni a trovarci per scoprire il nostro showroom o contattaci per un appuntamento.
      Ti guideremo nella scelta dell’auto giusta per te.
    </p>
    <NuxtLink
      to="/contatti"
      class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-semibold px-6 py-3 rounded shadow-md transition"
    >
      Contattaci
    </NuxtLink>
  </div>
</div>


    </div>
  </section>
</template>
