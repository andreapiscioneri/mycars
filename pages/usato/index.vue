<script setup>
import { ref, computed, onMounted } from 'vue'

const veicoli = ref([])
const filtroMarca = ref([])
const filtroCarrozzeria = ref([])
const filtroCarburante = ref([])
const prezzoMin = ref('')
const prezzoMax = ref('')
const ricerca = ref('')
const ordinamento = ref('alfabetico-crescente')
const vista = ref('griglia')

const openSections = ref({
  Marca: false,
  Carrozzeria: false,
  Carburante: false,
  Prezzo: false
})

const toggleSection = (name) => {
  openSections.value[name] = !openSections.value[name]
}

const slugify = (str) =>
  str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')

onMounted(async () => {
  const res = await fetch('/api/veicoli')
  veicoli.value = await res.json()
})

const filtraVeicoli = computed(() => {
  let result = [...veicoli.value].filter(v => v.tipo === 'usato')

  if (filtroMarca.value.length > 0) {
    result = result.filter(v => filtroMarca.value.includes(v.marca))
  }
  if (filtroCarrozzeria.value.length > 0) {
    result = result.filter(v => filtroCarrozzeria.value.includes(v.carrozzeria))
  }
  if (filtroCarburante.value.length > 0) {
    result = result.filter(v => filtroCarburante.value.includes(v.carburante))
  }
  if (prezzoMin.value) {
    result = result.filter(v => parseFloat(v.prezzo) >= parseFloat(prezzoMin.value))
  }
  if (prezzoMax.value) {
    result = result.filter(v => parseFloat(v.prezzo) <= parseFloat(prezzoMax.value))
  }
  if (ricerca.value) {
    const q = ricerca.value.toLowerCase()
    result = result.filter(v =>
      v.titolo?.toLowerCase().includes(q) ||
      v.modello?.toLowerCase().includes(q) ||
      v.marca?.toLowerCase().includes(q)
    )
  }

  if (ordinamento.value === 'alfabetico-crescente') {
    result.sort((a, b) => (a.titolo || '').localeCompare(b.titolo || ''))
  } else if (ordinamento.value === 'alfabetico-decrescente') {
    result.sort((a, b) => (b.titolo || '').localeCompare(a.titolo || ''))
  }

  return result
})
</script>

<template>
  <section class="bg-black text-white py-20 px-4 md:px-10 min-h-screen">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
      <!-- FILTRI -->
      <aside class="space-y-4">
        <h2 class="text-lg font-bold text-white mb-2">Filtra</h2>

        <div
          v-for="(block, index) in [
            { title: 'Marca', model: filtroMarca, options: ['Audi', 'Mercedes', 'BMW'] },
            {
              title: 'Carrozzeria',
              model: filtroCarrozzeria,
              options: ['City Car', 'Cabrio', 'Coupé', 'Berlina', 'SUV', 'Furgonato', 'Station Wagon', 'Veicoli Commerciali']
            },
            {
              title: 'Carburante',
              model: filtroCarburante,
              options: ['Diesel', 'Benzina', 'Ibrida/Diesel', 'Elettrica']
            }
          ]"
          :key="index"
        >
          <div class="flex justify-between items-center cursor-pointer text-sm font-medium text-white/80 py-1" @click="toggleSection(block.title)">
            <span>{{ block.title }}</span>
            <span class="text-white text-base font-bold">{{ openSections[block.title] ? '−' : '+' }}</span>
          </div>
          <transition name="fade">
            <div v-if="openSections[block.title]" class="pl-1 mt-1 space-y-1">
              <label
                v-for="opt in block.options"
                :key="opt"
                class="flex items-center gap-2 text-sm text-white/70"
              >
                <input
                  type="checkbox"
                  :value="opt"
                  v-model="block.model"
                  class="accent-[#A30000]"
                />
                {{ opt }}
              </label>
            </div>
          </transition>
        </div>

        <!-- Prezzo -->
        <div>
          <div class="flex justify-between items-center cursor-pointer text-sm font-medium text-white/80 py-1" @click="toggleSection('Prezzo')">
            <span>Prezzo</span>
            <span class="text-white text-base font-bold">{{ openSections.Prezzo ? '−' : '+' }}</span>
          </div>
          <transition name="fade">
            <div v-if="openSections.Prezzo" class="flex gap-2 mt-2">
              <input v-model="prezzoMin" type="number" placeholder="Min" class="w-1/2 bg-[#1a1a1a] text-white px-2 py-1 rounded border border-white/10 placeholder-white/40 text-sm" />
              <input v-model="prezzoMax" type="number" placeholder="Max" class="w-1/2 bg-[#1a1a1a] text-white px-2 py-1 rounded border border-white/10 placeholder-white/40 text-sm" />
            </div>
          </transition>
        </div>
      </aside>

      <!-- CONTENUTO -->
      <main class="space-y-8 w-full">
        <div class="flex flex-wrap justify-between items-center gap-4">
          <input
            v-model="ricerca"
            placeholder="Cerca per modello, codice, marca..."
            class="w-full sm:w-auto flex-1 bg-[#1a1a1a] border border-white/10 text-white px-4 py-2 rounded placeholder-white/40 text-sm"
          />

          <div class="flex items-center gap-2">
            <label class="text-white/60 text-sm">Ordina per</label>
            <div class="relative w-full md:w-auto">
              <select
                v-model="ordinamento"
                class="bg-[#1a1a1a] border border-white/10 text-white text-sm px-4 py-2 pr-8 rounded-lg appearance-none w-full"
              >
                <option value="alfabetico-crescente">Ordine crescente</option>
                <option value="alfabetico-decrescente">Ordine decrescente</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/40 text-xs">
                ▼
              </div>
            </div>
          </div>

<!-- Vista Toggle con Icone -->
<div class="flex items-center gap-2">
  <button
    @click="vista = 'griglia'"
    :class="vista === 'griglia' ? 'bg-white/10 border border-white text-red-500' : 'text-white/40'"
    class="p-2 rounded transition hover:bg-white/10"
    aria-label="Vista Griglia"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
    </svg>
  </button>

  <button
    @click="vista = 'lista'"
    :class="vista === 'lista' ? 'bg-white/10 border border-white text-red-500' : 'text-white/40'"
    class="p-2 rounded transition hover:bg-white/10"
    aria-label="Vista Lista"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"/>
    </svg>
  </button>
</div>

        </div>

        <!-- Griglia -->
        <div v-if="vista === 'griglia'" class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="v in filtraVeicoli"
            :key="v.codice || v.titolo || v.modello"
            class="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img :src="v.immagine || '/placeholder.jpg'" class="w-full h-48 object-cover" />
            <div class="p-4 space-y-2">
              <h3 class="text-base font-bold text-white">{{ v.titolo }}</h3>
              <p class="text-sm text-white/70">{{ v.marca }} {{ v.modello }}</p>
              <p class="text-xs text-white/50">Anno: {{ v.anno || 'n.d.' }}</p>
              <p class="text-xs text-white/50">Chilometri: {{ v.chilometri ? v.chilometri + ' km' : 'n.d.' }}</p>
              <p class="text-xs text-white/50">Prezzo: {{ v.prezzo ? v.prezzo + ' €' : 'n.d.' }}</p>
              <p class="text-xs text-white/50">Venditore: {{ v.venditore }}</p>

              <div class="flex justify-between items-center mt-3">
                <NuxtLink :to="`/usato/${slugify(v.titolo)}-${v.codice}`" class="bg-[#A30000] hover:bg-red-800 text-white px-4 py-1.5 text-sm rounded shadow">
                  Dettagli
                </NuxtLink>
                <span class="text-white/30 text-lg font-bold">&gt;</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista -->
        <div v-else-if="vista === 'lista'" class="space-y-4">
          <div
            v-for="v in filtraVeicoli"
            :key="v.codice"
            class="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow hover:shadow-lg transition p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <img :src="v.immagine || '/placeholder.jpg'" class="w-full sm:w-40 h-32 object-cover rounded" />
            <div class="flex-1 space-y-1">
              <h3 class="text-lg font-semibold text-white">{{ v.titolo }}</h3>
              <p class="text-sm text-white/70">{{ v.marca }} {{ v.modello }}</p>
              <p class="text-xs text-white/50">Anno: {{ v.anno || 'n.d.' }}</p>
              <p class="text-xs text-white/50">Chilometri: {{ v.chilometri ? v.chilometri + ' km' : 'n.d.' }}</p>
              <p class="text-xs text-white/50">Prezzo: {{ v.prezzo ? v.prezzo + ' €' : 'n.d.' }}</p>
              <p class="text-xs text-white/50">Venditore: {{ v.venditore }}</p>
              <NuxtLink :to="`/usato/${slugify(v.titolo)}-${v.codice}`" class="inline-block mt-2 bg-[#A30000] hover:bg-red-800 text-white px-4 py-1.5 text-sm rounded shadow">
                Dettagli
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Conteggio -->
        <p class="text-sm text-white/40">{{ filtraVeicoli.length }} veicoli trovati</p>
      </main>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
