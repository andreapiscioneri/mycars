<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '#imports' // 👈 assicurati che sia presente
const { data: veicoli } = await useFetch('/veicoli.json')
useHead({
  title: 'Auto Usate a Bergamo | Occasioni Garantite - MyCars',
  meta: [
    {
      name: 'description',
      content: 'Trova auto usate garantite a Bergamo. Filtra per marca, chilometri, prezzo e anno. Scopri le offerte di MyCars con chilometraggi certificati e controlli professionali.',
    },
    {
      name: 'keywords',
      content: 'auto usate Bergamo, auto in vendita, occasioni auto usate, veicoli garantiti, auto km 0, usato sicuro Bergamo',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Auto Usate a Bergamo | Occasioni Garantite - MyCars' },
    {
      property: 'og:description',
      content: 'Cerca tra le migliori occasioni di auto usate garantite a Bergamo. MyCars offre veicoli certificati con chilometraggio trasparente.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/usato' },
    { property: 'og:image', content: 'https://www.mycarsbergamo.it/og-image.jpg' } // opzionale, se hai immagine OpenGraph
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/usato' }
  ]
})


const filtroMarca = ref([])
const filtroCarrozzeria = ref([])
const filtroCarburante = ref([])
const filtroVenditore = ref([])
const filtroChilometriMin = ref('')
const filtroChilometriMax = ref('')
const filtroAnnoMin = ref('')
const filtroAnnoMax = ref('')
const prezzoMin = ref('')
const prezzoMax = ref('')
const ricerca = ref('')
const ordinamento = ref('alfabetico-crescente')
const vista = ref('griglia')

const openSections = ref({
  Marca: false,
  Carrozzeria: false,
  Carburante: false,
  Prezzo: false,
  Venditore: false,
  Chilometri: false,
  Anno: false,
})

const toggleSection = (name) => {
  openSections.value[name] = !openSections.value[name]
}

const slugify = (str) =>
  str.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')


const filtraVeicoli = computed(() => {
  let result = veicoli.value.filter(v => v.tipo === 'usato')

  if (filtroMarca.value.length > 0)
    result = result.filter(v => filtroMarca.value.includes(v.marca))

  if (filtroCarrozzeria.value.length > 0)
    result = result.filter(v => filtroCarrozzeria.value.includes(v.carrozzeria))

  if (filtroCarburante.value.length > 0)
    result = result.filter(v => filtroCarburante.value.includes(v.carburante))

  if (filtroVenditore.value.length > 0)
    result = result.filter(v => filtroVenditore.value.includes(v.venditore))

  if (prezzoMin.value)
    result = result.filter(v => parseFloat(v.prezzo) >= parseFloat(prezzoMin.value))

  if (prezzoMax.value)
    result = result.filter(v => parseFloat(v.prezzo) <= parseFloat(prezzoMax.value))

  if (filtroChilometriMin.value)
    result = result.filter(v => parseInt(v.chilometri) >= parseInt(filtroChilometriMin.value))

  if (filtroChilometriMax.value)
    result = result.filter(v => parseInt(v.chilometri) <= parseInt(filtroChilometriMax.value))

  if (filtroAnnoMin.value)
    result = result.filter(v => new Date(v.anno) >= new Date(filtroAnnoMin.value))

  if (filtroAnnoMax.value)
    result = result.filter(v => new Date(v.anno) <= new Date(filtroAnnoMax.value))

  if (ricerca.value) {
    const q = ricerca.value.toLowerCase()
    result = result.filter(v =>
      v.titolo?.toLowerCase().includes(q) ||
      v.modello?.toLowerCase().includes(q) ||
      v.marca?.toLowerCase().includes(q)
    )
  }

  if (ordinamento.value === 'alfabetico-crescente')
    result.sort((a, b) => (a.titolo || '').localeCompare(b.titolo || ''))
  else if (ordinamento.value === 'alfabetico-decrescente')
    result.sort((a, b) => (b.titolo || '').localeCompare(a.titolo || ''))

  return result
})
</script>

<template>
  <section class="bg-black text-white py-10 px-6 min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
    <!-- FILTRI -->
    <aside class="space-y-6">
      <h2 class="text-xl font-bold">Filtra</h2>

      <!-- Marca -->
      <div>
        <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('Marca')">
          <span class="font-semibold">Marca</span>
          <span>{{ openSections.Marca ? '−' : '+' }}</span>
        </div>
        <div v-if="openSections.Marca" class="mt-2 space-y-1">
          <label v-for="opt in [...new Set(veicoli.map(v => v.marca))]" :key="opt" class="flex items-center gap-2 text-sm">
            <input type="checkbox" :value="opt" v-model="filtroMarca" />
            {{ opt }}
          </label>
        </div>
      </div>

      <!-- Carrozzeria -->
      <div>
        <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('Carrozzeria')">
          <span class="font-semibold">Carrozzeria</span>
          <span>{{ openSections.Carrozzeria ? '−' : '+' }}</span>
        </div>
        <div v-if="openSections.Carrozzeria" class="mt-2 space-y-1">
          <label v-for="opt in [...new Set(veicoli.map(v => v.carrozzeria))]" :key="opt" class="flex items-center gap-2 text-sm">
            <input type="checkbox" :value="opt" v-model="filtroCarrozzeria" />
            {{ opt }}
          </label>
        </div>
      </div>

      <!-- Carburante -->
      <div>
        <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('Carburante')">
          <span class="font-semibold">Carburante</span>
          <span>{{ openSections.Carburante ? '−' : '+' }}</span>
        </div>
        <div v-if="openSections.Carburante" class="mt-2 space-y-1">
          <label v-for="opt in [...new Set(veicoli.map(v => v.carburante))]" :key="opt" class="flex items-center gap-2 text-sm">
            <input type="checkbox" :value="opt" v-model="filtroCarburante" />
            {{ opt }}
          </label>
        </div>
      </div>

      <!-- Venditore -->
      <div>
        <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('Venditore')">
          <span class="font-semibold">Venditore</span>
          <span>{{ openSections.Venditore ? '−' : '+' }}</span>
        </div>
        <div v-if="openSections.Venditore" class="mt-2 space-y-1">
          <label v-for="opt in [...new Set(veicoli.map(v => v.venditore))]" :key="opt" class="flex items-center gap-2 text-sm">
            <input type="checkbox" :value="opt" v-model="filtroVenditore" />
            {{ opt }}
          </label>
        </div>
      </div>

      <!-- Prezzo -->
      <div>
        <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('Prezzo')">
          <span class="font-semibold">Prezzo</span>
          <span>{{ openSections.Prezzo ? '−' : '+' }}</span>
        </div>
        <div v-if="openSections.Prezzo" class="flex gap-2 mt-2">
          <input v-model="prezzoMin" type="number" placeholder="Min" class="input w-1/2" />
          <input v-model="prezzoMax" type="number" placeholder="Max" class="input w-1/2" />
        </div>
      </div>

      <!-- Chilometri -->
      <div>
        <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('Chilometri')">
          <span class="font-semibold">Chilometri</span>
          <span>{{ openSections.Chilometri ? '−' : '+' }}</span>
        </div>
        <div v-if="openSections.Chilometri" class="flex gap-2 mt-2">
          <input v-model="filtroChilometriMin" type="number" placeholder="Min" class="input w-1/2" />
          <input v-model="filtroChilometriMax" type="number" placeholder="Max" class="input w-1/2" />
        </div>
      </div>

      <!-- Anno -->
      <div>
        <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('Anno')">
          <span class="font-semibold">Anno</span>
          <span>{{ openSections.Anno ? '−' : '+' }}</span>
        </div>
        <div v-if="openSections.Anno" class="flex gap-2 mt-2">
          <input v-model="filtroAnnoMin" type="date" class="input w-1/2" />
          <input v-model="filtroAnnoMax" type="date" class="input w-1/2" />
        </div>
      </div>
    </aside>

    <!-- CONTENUTO -->
    <main class="space-y-6 w-full">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <input
          v-model="ricerca"
          class="input w-full sm:w-auto flex-1"
          placeholder="Cerca per modello, codice, marca..."
        />

        <div class="flex items-center gap-2">
            <label class="text-white/60 text-sm">Ordina</label>
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



      <!-- VISTA GRIGLIA -->
<div v-if="vista === 'griglia'" class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
  <div
    v-for="v in filtraVeicoli"
    :key="v.codice"
    class="bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col"
  >
    <img :src="v.immagine || '/placeholder.jpg'" class="w-full h-48 object-cover" />
    <div class="p-4 flex flex-col flex-1 justify-between">
      <div class="space-y-1">
        <h3 class="text-base font-bold text-white">{{ v.titolo }}</h3>
        <p class="text-sm text-white/70">{{ v.marca }} {{ v.modello }}</p>
        <p class="text-xs text-white/50">Anno: {{ v.anno || 'n.d.' }}</p>
        <p class="text-xs text-white/50">Chilometri: {{ v.chilometri || 'n.d.' }} km</p>
        <p class="text-xs text-white/50">Prezzo: {{ v.prezzo || 'n.d.' }} €</p>
        <p class="text-xs text-white/50">Venditore: {{ v.venditore }}</p>
      </div>
      <NuxtLink
        :to="`/usato/${slugify(v.titolo)}-${v.codice}`"
        class="block w-full text-center bg-red-700 hover:bg-red-800 text-white py-2 mt-4 rounded"
      >
        Dettagli
      </NuxtLink>
    </div>
  </div>
</div>


      <!-- VISTA LISTA -->
      <div v-else class="space-y-4">
        <div v-for="v in filtraVeicoli" :key="v.codice" class="bg-[#111] p-4 rounded-lg border border-white/10 flex flex-col sm:flex-row gap-4">
          <img :src="v.immagine" class="w-full sm:w-40 h-32 object-cover rounded" />
          <div class="flex-1 space-y-1">
            <h3 class="text-lg font-semibold text-white">{{ v.titolo }}</h3>
            <p class="text-sm text-white/70">{{ v.marca }} {{ v.modello }}</p>
            <p class="text-xs text-white/50">Anno: {{ v.anno }}</p>
            <p class="text-xs text-white/50">Chilometri: {{ v.chilometri }} km</p>
            <p class="text-xs text-white/50">Prezzo: {{ v.prezzo }} €</p>
            <p class="text-xs text-white/50">Venditore: {{ v.venditore }}</p>
            <NuxtLink :to="`/usato/${slugify(v.titolo)}-${v.codice}`" class="inline-block mt-2 bg-red-700 hover:bg-red-800 text-white px-4 py-1.5 text-sm rounded shadow">Dettagli</NuxtLink>
          </div>
        </div>
      </div>

      <p class="text-sm text-white/40">{{ filtraVeicoli.length }} veicoli trovati</p>
    </main>
  </section>
</template>

<style scoped>
.input {
  background-color: #1a1a1a;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #333;
  font-size: 0.875rem;
}
</style>
