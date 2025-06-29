<template>
  <section class="w-full bg-black text-white">
    <!-- Hero -->
    <div
      class="h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center relative"
      style="background-image: url('/static/images/12.jpg')"
    >
      <div class="absolute inset-0 bg-opacity-60"></div>
      <h1 class="relative text-4xl md:text-5xl font-extrabold text-[#A30000] text-center">
Servizi
      </h1>
    </div>

    <!-- Contenuto -->
    <div class="max-w-6xl mx-auto pt-12 pb-40 px-4 space-y-20">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">Vendita Auto Usate Selezionate</h2>
          <p class="text-white/90">
            Ogni veicolo è attentamente ispezionato e certificato per garantire qualità, affidabilità e sicurezza. Offriamo solo auto usate in ottime condizioni, con chilometraggi certificati e garanzia inclusa.</p>
        </div>
        <img src="/static/images/10.jpg" alt="Auto elegante" class="rounded-lg shadow-xl w-full object-cover" />
      </div>

<div class="grid md:grid-cols-2 gap-12 items-center">
  <!-- Immagine a sinistra -->
  <img
    src="/static/images/14.jpg"
    alt="Auto elegante"
    class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
  />

  <!-- Testo a destra -->
  <div class="space-y-4">
    <h2 class="text-3xl font-bold text-[#A30000]">
Consulenza e ricerca personalizzata
    </h2>
    <p class="text-white/90">
Ti aiutiamo a trovare l’auto giusta per il tuo budget e le tue esigenze. Se non è in stock, la cerchiamo per te grazie a una rete di partner selezionati.
    </p>
  </div>
          <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">Permute e Valutazione Gratuita</h2>
          <p class="text-white/90">
Ritiriamo il tuo usato offrendoti una valutazione trasparente e in linea con il mercato. Nessun obbligo d’acquisto, massima comodità.</p>
        </div>
        <img src="/static/images/13.jpg" alt="Auto elegante" class="rounded-lg shadow-xl w-full object-cover" />
      </div>
<div class="grid md:grid-cols-2 gap-12 items-center">
  <!-- Immagine a sinistra -->
  <img
    src="/static/images/11.jpg"
    alt="Auto elegante"
    class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
  />

  <!-- Testo a destra -->
  <div class="space-y-4">
    <h2 class="text-3xl font-bold text-[#A30000]">
Assistenza Post-Vendita
    </h2>
    <p class="text-white/90">
Siamo con te anche dopo l’acquisto: tagliandi, garanzie, supporto tecnico e pratiche burocratiche. Il nostro servizio non finisce alla consegna.
    </p>
  </div>
</div>
      <!-- CTA finale -->
      <div class="flex justify-center pt-10">
    <NuxtLink
      to="/contatti"
      class="inline-block bg-[#A30000] hover:bg-red-800 text-white font-semibold px-6 py-3 rounded shadow-md transition"
    >
      Contattaci
    </NuxtLink>
      </div>

    </div>
  </section>
</template>
