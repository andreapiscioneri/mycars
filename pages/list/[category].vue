<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const items = ref([])
const loading = ref(true)

// Get category from URL parameter
const category = computed(() => route.params.category)

// Validate category
const validCategories = ['used', 'rent']
const isValidCategory = computed(() => validCategories.includes(category.value))

// Set page title and meta based on category
const pageTitle = computed(() => {
  if (category.value === 'used') return 'Auto Usate a Bergamo | Occasioni Garantite - MyCars'
  if (category.value === 'rent') return 'Auto a Noleggio a Bergamo | Noleggio Auto - MyCars'
  return 'Lista Auto - MyCars'
})

const pageDescription = computed(() => {
  if (category.value === 'used') {
    return 'Trova auto usate garantite a Bergamo. Filtra per marca, chilometri, prezzo e anno. Scopri le offerte di MyCars con chilometraggi certificati e controlli professionali.'
  }
  if (category.value === 'rent') {
    return 'Noleggia auto a Bergamo. Ampia flotta di veicoli per ogni esigenza. Noleggio breve e lungo termine con prezzi competitivi.'
  }
  return 'Lista auto disponibili'
})

const categoryLabel = computed(() => {
  if (category.value === 'used') return 'Auto Usate'
  if (category.value === 'rent') return 'Auto a Noleggio'
  return 'Auto'
})

// Set page meta
useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: pageDescription,
    },
    {
      name: 'keywords',
      content: category.value === 'used' 
        ? 'auto usate Bergamo, auto in vendita, occasioni auto usate, veicoli garantiti, auto km 0, usato sicuro Bergamo'
        : 'noleggio auto Bergamo, auto a noleggio, affitto auto, noleggio breve termine, noleggio lungo termine Bergamo',
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: pageTitle },
    {
      property: 'og:description',
      content: pageDescription,
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `https://www.mycarsbergamo.it/list/${category.value}` },
  ],
  link: [
    { rel: 'canonical', href: `https://www.mycarsbergamo.it/list/${category.value}` }
  ]
})

onMounted(async () => {
  // Redirect to 404 if category is not valid
  if (!isValidCategory.value) {
    router.push('/404')
    return
  }

  try {
    const snapshot = await getDocs(collection(db, 'cars'))
    items.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter(v => v.category === category.value)
  } catch (error) {
    console.error('Error loading cars:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen bg-black">
    <!-- Sidebar Filter -->
    <aside class="hidden md:block w-64 bg-black border-r border-gray-900 p-6 text-white min-h-screen">
      <h2 class="text-2xl font-bold mb-8">Filtra</h2>
      <div class="space-y-6">
        <div class="flex justify-between items-center cursor-pointer mb-2">
          <span>Marca</span>
          <span class="text-2xl">+</span>
        </div>
        <div class="flex justify-between items-center cursor-pointer mb-2">
          <span>Carrozzeria</span>
          <span class="text-2xl">+</span>
        </div>
        <div class="flex justify-between items-center cursor-pointer mb-2">
          <span>Carburante</span>
          <span class="text-2xl">+</span>
        </div>
        <div class="flex justify-between items-center cursor-pointer mb-2">
          <span>Venditore</span>
          <span class="text-2xl">+</span>
        </div>
        <div class="flex justify-between items-center cursor-pointer mb-2">
          <span>Prezzo</span>
          <span class="text-2xl">+</span>
        </div>
        <div class="flex justify-between items-center cursor-pointer mb-2">
          <span>Chilometri</span>
          <span class="text-2xl">+</span>
        </div>
        <div class="flex justify-between items-center cursor-pointer mb-2">
          <span>Anno</span>
          <span class="text-2xl">+</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Top Bar: Search & Sort -->
      <div class="w-full px-4 py-6 flex flex-col md:flex-row md:items-center gap-4 bg-black border-b border-gray-800">
        <input
          type="text"
          placeholder="Cerca per modello, codice, marca..."
          class="flex-1 bg-[#18181b] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A30000] placeholder-gray-400"
        />
        <div class="flex items-center gap-2">
          <span class="text-white">Ordina</span>
          <select class="bg-black text-white rounded px-3 py-2 focus:outline-none border border-gray-700">
            <option>Ordine crescente</option>
            <option>Ordine decrescente</option>
          </select>
          <button class="ml-2 p-2 rounded bg-black border border-gray-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
      <div class="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div class="mb-4 text-gray-400">{{ items.length }} veicoli trovati</div>
        <Items :items="items" v-if="!loading" />
        <LoadingSpinner v-if="loading" />
        <div v-if="!loading && items.length === 0" class="text-center py-16">
          <p class="text-gray-500 text-lg">Nessuna auto trovata in questa categoria.</p>
        </div>
      </div>
    </div>
  </div>
</template> 