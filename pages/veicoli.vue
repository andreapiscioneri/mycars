<script setup>
import { ref, computed, onMounted } from 'vue'

const veicoli = ref([])
const filtroAllestimento = ref([])
const ricerca = ref('')
const ordinamento = ref('altezza-crescente')

onMounted(async () => {
  const res = await fetch('/api/veicoli')
  veicoli.value = await res.json()
})

const filtraVeicoli = computed(() => {
  let result = [...veicoli.value]

  if (filtroAllestimento.value.length > 0) {
    result = result.filter(v => filtroAllestimento.value.includes(v.allestimento))
  }

  if (ricerca.value) {
    const q = ricerca.value.toLowerCase()
    result = result.filter(v =>
      v.titolo.toLowerCase().includes(q) ||
      v.modello.toLowerCase().includes(q) ||
      v.marca.toLowerCase().includes(q)
    )
  }

  if (ordinamento.value === 'altezza-crescente') {
    result.sort((a, b) => a.altezza - b.altezza)
  } else if (ordinamento.value === 'altezza-decrescente') {
    result.sort((a, b) => b.altezza - a.altezza)
  }

  return result
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 mt-6">
    <div class="flex flex-col md:flex-row gap-6">

      <!-- FILTRI -->
      <aside class="w-full md:w-64 border p-4 rounded text-sm shadow bg-white">
        <button class="bg-blue-700 text-white px-4 py-2 w-full font-bold rounded mb-4">Gru per autocarro</button>

        <div>
          <h3 class="font-bold mb-2">Allestimenti</h3>
          <div v-for="option in ['2 assi', '3 assi', '4 assi', 'Speciali', 'Trattori']" :key="option" class="mb-1">
            <label class="flex items-center gap-2">
              <input type="checkbox" :value="option" v-model="filtroAllestimento" />
              <span :class="{ 'text-gray-800': true, 'opacity-60': !filtroAllestimento.includes(option) }">{{ option }}</span>
            </label>
          </div>
        </div>

        <div class="mt-4 space-y-1">
          <NuxtLink to="#" class="block hover:underline text-black">Prodotti</NuxtLink>
          <NuxtLink to="#" class="block hover:underline text-black">Usato</NuxtLink>
        </div>
      </aside>

      <!-- CONTENUTO -->
      <main class="flex-1">

        <!-- Barra superiore -->
        <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
          <input
            v-model="ricerca"
            placeholder="codice, modello, marca anno etc..."
            class="border px-4 py-2 w-full md:w-96 text-sm rounded"
          />
          <button class="bg-blue-700 text-white px-4 py-2 rounded text-sm">Cerca</button>

          <div class="flex items-center gap-2 ml-auto">
            <label class="text-sm font-medium">Ordina per</label>
            <select v-model="ordinamento" class="border px-2 py-1 rounded text-sm">
              <option value="altezza-crescente">Altezza crescente</option>
              <option value="altezza-decrescente">Altezza decrescente</option>
              <option value="disponibilita">Disponibilità presso</option>
              <option value="offerte">Data offerte</option>
            </select>
          </div>
        </div>

        <!-- Lista veicoli -->
        <div v-for="(v, index) in filtraVeicoli" :key="index" class="border rounded-lg overflow-hidden bg-white shadow flex mb-6">

          <img :src="v.immagine" class="w-60 h-44 object-cover" alt="foto veicolo" />

          <div class="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div class="text-xs bg-green-600 text-white inline-block px-2 py-1 rounded mb-1 font-bold">DISPONIBILE</div>
              <h2 class="font-bold text-base">{{ v.titolo }}</h2>
              <p class="text-sm">{{ v.modello }}</p>
              <p class="text-xs text-blue-600 font-medium">Numero di contratto: {{ v.codice }}</p>
              <p class="text-xs text-gray-700 mt-1">Dettagli dealer<br />{{ v.dealer }}</p>
            </div>

            <div class="flex justify-between items-center mt-2">
              <button class="bg-blue-700 text-white px-4 py-2 text-sm rounded">Contattaci</button>
              <span class="text-blue-700 font-bold text-lg">&gt;</span>
            </div>
          </div>

        </div>

        <p class="text-sm text-gray-600">{{ filtraVeicoli.length }} Prodotti Trovati</p>
        <div class="flex justify-end items-center gap-1 mt-4">
          <button class="border px-3 py-1 rounded">&lt;</button>
          <button class="bg-blue-700 text-white px-3 py-1 rounded text-sm">1</button>
          <button class="border px-3 py-1 rounded text-sm">2</button>
          <button class="border px-3 py-1 rounded">&gt;</button>
        </div>
      </main>
    </div>
  </div>
</template>
