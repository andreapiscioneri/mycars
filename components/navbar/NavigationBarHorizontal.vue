<script setup lang="ts">
</script>

<template>
  <header class="bg-black text-white border-b border-blue-800">
    <!-- Top Bar -->
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Sinistra: Ricerca -->
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
        </svg>
        <input
          type="text"
          placeholder="Cerca..."
          class="bg-transparent border-none focus:outline-none text-sm placeholder-white w-28 sm:w-40"
        />
      </div>

      <!-- Centro: Logo Testuale -->
      <div class="text-base font-semibold text-white tracking-wide text-center">
        Brennero Gru
      </div>

      <!-- Destra: Brand + lingua -->
      <div class="flex items-center gap-3 text-sm">
        <span>BGLIFT</span>
        <span class="text-xs">🇮🇹</span>
      </div>
    </div>

    <!-- Menu principale -->
    <nav class="max-w-7xl mx-auto px-4 flex justify-between items-center border-t border-blue-800 text-sm">
      <NuxtLink to="/chisiamo" class="flex-1 text-center py-3 hover:underline">Chi siamo</NuxtLink>
      <NuxtLink to="/prodotti" class="flex-1 text-center py-3 hover:underline">Prodotti</NuxtLink>
      <NuxtLink to="/allestimenti" class="flex-1 text-center py-3 hover:underline">Allestimenti veicoli</NuxtLink>
      <NuxtLink to="/servizi" class="flex-1 text-center py-3 hover:underline">Servizi</NuxtLink>
      <NuxtLink to="/usato" class="flex-1 text-center py-3 hover:underline">Usato</NuxtLink>
      <NuxtLink to="/contatti" class="flex-1 text-center py-3 hover:underline">Contatti</NuxtLink>
    </nav>
  </header>
</template>
