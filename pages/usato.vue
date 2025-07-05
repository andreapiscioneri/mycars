<script setup>
import { ref, computed, onMounted } from 'vue'
import Id from './veicoli/[id].vue'

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

onMounted(async () => {
  const res = await fetch('/api/veicoli')
  veicoli.value = await res.json()
})

const filtraVeicoli = computed(() => {
  let result = [...veicoli.value]

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
    result = result.filter(v => v.prezzo >= parseInt(prezzoMin.value))
  }
  if (prezzoMax.value) {
    result = result.filter(v => v.prezzo <= parseInt(prezzoMax.value))
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
            { title: 'Carrozzeria', model: filtroCarrozzeria, options: ['City Car', 'Cabrio', 'Coupé', 'Berlina', 'SUV', 'Furgonato', 'Station Wagon', 'Veicoli Commerciali'] },
            { title: 'Carburante', model: filtroCarburante, options: ['Diesel', 'Benzina', 'Ibrida/Diesel', 'Elettrica'] }
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
                  :aria-label="`Filtro ${block.title} ${opt}`"
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
              <input v-model="prezzoMin" type="number" placeholder="Min" class="w-1/2 bg-[#1a1a1a] text-white px-2 py-1 rounded border border-white/10 placeholder-white/40 text-sm" aria-label="Prezzo minimo" />
              <input v-model="prezzoMax" type="number" placeholder="Max" class="w-1/2 bg-[#1a1a1a] text-white px-2 py-1 rounded border border-white/10 placeholder-white/40 text-sm" aria-label="Prezzo massimo" />
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
            aria-label="Campo ricerca veicolo"
          />

          <div class="flex items-center gap-2">
            <label class="text-white/60 text-sm">Ordina per</label>
            <div class="relative w-full md:w-auto">
              <select
                v-model="ordinamento"
                class="bg-[#1a1a1a] border border-white/10 text-white text-sm px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] appearance-none w-full"
                aria-label="Ordinamento"
              >
                <option value="alfabetico-crescente">Ordine crescente</option>
                <option value="alfabetico-decrescente">Ordine decrescente</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/40 text-xs">
                ▼
              </div>
            </div>

            <!-- Toggle vista -->
            <div class="flex items-center gap-1">
              <button
                @click="vista = 'griglia'"
                :class="vista === 'griglia' ? 'bg-[#A30000] text-white' : 'bg-[#333] text-white/40'"
                class="w-10 h-10 flex items-center justify-center rounded-lg transition"
                aria-label="Vista griglia"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4h5v5H4V4zm0 11h5v5H4v-5zm11-11h5v5h-5V4zm0 11h5v5h-5v-5z" />
                </svg>
              </button>
              <button
                @click="vista = 'lista'"
                :class="vista === 'lista' ? 'bg-[#A30000] text-white' : 'bg-[#333] text-white/40'"
                class="w-10 h-10 flex items-center justify-center rounded-lg transition"
                aria-label="Vista lista"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Griglia -->
        <div v-if="vista === 'griglia'" class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="v in filtraVeicoli"
            :key="v.codice || v.titolo || v.modello"
            class="bg-[#111] border border-white/10 rounded-xl overflow-hidden transition shadow hover:shadow-lg"
          >
            <img :src="v.immagine || '/placeholder.jpg'" class="w-full h-48 object-cover" />
            <div class="p-4 space-y-2">
              <h3 class="text-base font-bold text-white">{{ v.titolo }}</h3>
              <p class="text-sm text-white/70">{{ v.modello }}</p>
              <p class="text-xs text-[#A30000]">Codice: {{ v.codice }}</p>
              <p class="text-xs text-white/50">Dealer: {{ v.dealer }}</p>
              <div class="flex justify-between items-center mt-3">

                <NuxtLink :to="`/veicoli/${Id}`" class="bg-[#A30000] hover:bg-red-800 text-white px-4 py-1.5 text-sm rounded shadow">
                Dettagli
              </NuxtLink>
                <span class="text-white/30 text-lg font-bold">&gt;</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista -->
        <div v-else class="space-y-4">
          <div
            v-for="v in filtraVeicoli"
            :key="v.codice || v.titolo || v.modello"
            class="flex flex-col sm:flex-row gap-4 bg-[#111] border border-white/10 rounded-xl overflow-hidden transition shadow hover:shadow-lg"
          >
            <img :src="v.immagine || '/placeholder.jpg'" class="w-full sm:w-60 h-48 object-cover" />
            <div class="flex flex-col justify-between py-3 pr-4 pl-3 space-y-1 flex-1">
              <div>
                <h3 class="text-lg font-bold text-white">{{ v.titolo }}</h3>
                <p class="text-sm text-white/70">{{ v.modello }}</p>
                <p class="text-xs text-[#A30000]">Codice: {{ v.codice }}</p>
                <p class="text-xs text-white/50">Dealer: {{ v.dealer }}</p>
              </div>
              <div class="flex justify-between items-center mt-2">
                <button class="bg-[#A30000] hover:bg-red-800 text-white px-4 py-1.5 text-sm rounded shadow">Contattaci</button>
                <span class="text-white/30 text-lg font-bold">&gt;</span>
              </div>
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
