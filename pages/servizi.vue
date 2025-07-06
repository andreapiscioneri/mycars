<script setup lang="ts">
useHead({
  title: 'Servizi Auto - Vendita, Noleggio e Assistenza | MyCars Bergamo',
  meta: [
    {
      name: 'description',
      content:
        'Scopri i servizi offerti da MyCars: auto usate, noleggio, assistenza post-vendita, consulenza personalizzata, permute e valutazioni gratuite.',
    },
    {
      name: 'keywords',
      content:
        'servizi auto usate, noleggio auto, permute auto, consulenza auto, assistenza post-vendita auto, valutazione auto usata Bergamo',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Servizi Auto - Vendita, Noleggio e Assistenza | MyCars Bergamo' },
    {
      property: 'og:description',
      content:
        'Vendita auto usate, noleggio e servizi completi post-vendita. Scopri tutti i servizi MyCars per la tua prossima auto.',
    },
    { property: 'og:image', content: 'https://www.mycarsbergamo.it/static/images/12.jpg' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/servizi' },
    { property: 'og:type', content: 'website' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.mycarsbergamo.it/servizi' }],
})
</script>

<template>
  <section class="w-full bg-black text-white">
    <!-- Hero -->
    <div
      class="h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center relative"
      style="background-image: url('/static/images/12.jpg')"
    >
      <div class="absolute inset-0 bg-opacity-60"></div>
      <h1 class="relative text-4xl md:text-5xl font-extrabold text-white text-center">Servizi</h1>
    </div>

    <!-- Contenuto -->
    <div class="max-w-6xl mx-auto pt-12 pb-40 px-4 space-y-20">
      <!-- Blocco 1 -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">Vendita Auto Usate e Noleggio</h2>
          <p class="text-white/90">
            Ogni veicolo è attentamente ispezionato e certificato per garantire qualità, affidabilità e sicurezza.
            Offriamo solo auto usate in ottime condizioni, con chilometraggi certificati e garanzia inclusa.
          </p>
        </div>
        <img
          src="/static/images/10.jpg"
          alt="Vendita auto usate e noleggio"
          class="rounded-lg shadow-xl w-full object-cover"
        />
      </div>

      <!-- Blocco 2 -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/static/images/14.jpg"
          alt="Consulenza personalizzata"
          class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
        />
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">Consulenza e Ricerca Personalizzata</h2>
          <p class="text-white/90">
            Ti aiutiamo a trovare l’auto giusta per il tuo budget e le tue esigenze. Se non è in stock, la cerchiamo per
            te grazie a una rete di partner selezionati.
          </p>
        </div>
      </div>

      <!-- Blocco 3 -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">Permute e Valutazione Gratuita</h2>
          <p class="text-white/90">
            Ritiriamo il tuo usato offrendoti una valutazione trasparente e in linea con il mercato. Nessun obbligo
            d’acquisto, massima comodità.
          </p>
        </div>
        <img
          src="/static/images/13.jpg"
          alt="Permuta auto"
          class="rounded-lg shadow-xl w-full object-cover"
        />
      </div>

      <!-- Blocco 4 -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/static/images/11.jpg"
          alt="Assistenza post vendita"
          class="rounded-lg shadow-xl w-full object-cover order-1 md:order-none"
        />
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-[#A30000]">Assistenza Post-Vendita</h2>
          <p class="text-white/90">
            Siamo con te anche dopo l’acquisto: tagliandi, garanzie, supporto tecnico e pratiche burocratiche.
            Il nostro servizio non finisce alla consegna.
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
