<script setup lang="ts">
</script>

<template>
  <div>
    <!-- HERO SECTION -->
    <section class="relative w-full h-screen bg-black text-white">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center space-y-6">
        <h1 class="text-3xl font-light uppercase tracking-wide">
          Autocarro semplice e complesso
        </h1>
        <div class="flex flex-col sm:flex-row justify-center gap-3 mt-4 px-4">
          <button class="bg-[#0052B4] text-white font-bold px-5 py-2 rounded w-full sm:w-auto">
            Autocarro
          </button>
          <button class="bg-white/10 text-white border border-white/30 px-5 py-2 rounded w-full sm:w-auto">
            Cingolate
          </button>
          <button class="bg-white/10 text-white border border-white/30 px-5 py-2 rounded w-full sm:w-auto">
            Piattaforme
          </button>
        </div>
      </div>
    </section>

    <!-- ALLESTIMENTI VEICOLI -->
    <section class="py-20 px-4 max-w-6xl mx-auto">
      <div class="text-center mb-10">
        <h2 class="text-6xl font-bold text-[#0052B4] leading-tight">
          Allestimenti
        </h2>
        <h2 class="text-6xl font-black text-black -mt-5">
          Veicoli
        </h2>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="bg-gray-100 p-6 rounded-lg shadow text-center">
          <p class="text-sm font-medium">Allestimento veicolo 1</p>
        </div>
        <div class="bg-gray-100 p-6 rounded-lg shadow text-center">
          <p class="text-sm font-medium">Allestimento veicolo 2</p>
        </div>
      </div>
    </section>

    <!-- PRODOTTI VENDUTI -->
    <section class="py-20 px-4 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
        <div class="lg:w-1/1 space-y-4">
          <h3 class="text-lg font-bold uppercase text-gray-800">Prodotti venduti</h3>
          <p class="text-gray-600">Descrizione dei prodotti venduti.</p>
          <button class="bg-[#1f2b52] text-white text-sm px-6 py-2 rounded shadow">
            Vai agli allestimenti →
          </button>
        </div>
        <div class="lg:w-1/2 text-center lg:text-right">
          <h2 class="text-6xl font-bold text-[#0052B4] leading-tight">Potenza</h2>
          <h2 class="text-6xl font-black text-black -mt-5">Dettaglio</h2>
        </div>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="p-4 text-center bg-gray-100 rounded-lg shadow">
          <p class="text-base font-bold">Innovazione</p>
        </div>
        <div class="p-4 text-center bg-gray-100 rounded-lg shadow">
          <p class="text-base font-bold">Potenza</p>
        </div>
        <div class="p-4 text-center bg-gray-100 rounded-lg shadow">
          <p class="text-base font-bold">Dettaglio</p>
        </div>
        <div class="p-4 text-center bg-gray-100 rounded-lg shadow">
          <p class="text-base font-bold">Prestazione</p>
        </div>
      </div>
    </section>

    <!-- CHI SIAMO -->
    <section class="py-20 px-4 max-w-4xl mx-auto text-center space-y-6">
      <h2 class="text-5xl font-extrabold text-[#1f2b52]">Chi siamo</h2>
      <p class="text-sm text-gray-800 leading-relaxed">
        Siamo un'azienda specializzata in soluzioni di sollevamento e allestimenti.
      </p>
      <p class="text-sm text-gray-800 leading-relaxed">
        Operiamo in tutta Italia con un team esperto e prodotti all'avanguardia.
      </p>
      <p class="text-sm text-gray-800">
        Scopri di più su 
        <a href="https://www.bglift.com" target="_blank" class="font-bold text-[#1f2b52] hover:underline">
          www.bglift.com
        </a>
      </p>
      <button class="bg-[#1f2b52] text-white text-sm px-6 py-2 rounded shadow">
        Scopri di più →
      </button>
    </section>
  </div>
</template>
