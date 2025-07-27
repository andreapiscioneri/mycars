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

// Search and filter states
const searchQuery = ref('')
const sortBy = ref('price-asc')

// Filter states
const filters = ref({
  brand: [],
  powerSource: [],
  seller: [],
  year: { min: null, max: null },
  price: { min: null, max: null },
  kilometers: { min: null, max: null }
})

// Filter panel toggle states
const filterPanelStates = ref({
  brand: false,
  carrozzeria: false,
  powerSource: false,
  seller: false,
  price: false,
  kilometers: false,
  year: false
})

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

// Get unique values for filters from the loaded data
const uniqueBrands = computed(() => {
  const brands = [...new Set(items.value.map(item => item.brand).filter(Boolean))]
  return brands.sort()
})

const uniquePowerSources = computed(() => {
  const powerSources = [...new Set(items.value.map(item => item.powerSource).filter(Boolean))]
  return powerSources.sort()
})

const uniqueSellers = computed(() => {
  const sellers = [...new Set(items.value.map(item => item.seller).filter(Boolean))]
  return sellers.sort()
})

const priceRange = computed(() => {
  const prices = items.value.map(item => parseFloat(item.price)).filter(p => !isNaN(p))
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
})

const kilometersRange = computed(() => {
  const kms = items.value.map(item => parseFloat(item.kilometers)).filter(k => !isNaN(k))
  return {
    min: Math.min(...kms),
    max: Math.max(...kms)
  }
})

const yearRange = computed(() => {
  const years = items.value.map(item => parseFloat(item.year)).filter(y => !isNaN(y))
  return {
    min: Math.min(...years),
    max: Math.max(...years)
  }
})

// Filtered and sorted items
const filteredItems = computed(() => {
  let filtered = items.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title?.toLowerCase().includes(query) ||
      item.subtitle?.toLowerCase().includes(query) ||
      item.brand?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
  }

  // Brand filter
  if (filters.value.brand.length > 0) {
    filtered = filtered.filter(item => filters.value.brand.includes(item.brand))
  }

  // Power source filter
  if (filters.value.powerSource.length > 0) {
    filtered = filtered.filter(item => filters.value.powerSource.includes(item.powerSource))
  }

  // Seller filter
  if (filters.value.seller.length > 0) {
    filtered = filtered.filter(item => filters.value.seller.includes(item.seller))
  }

  // Price range filter
  if (filters.value.price.min !== null || filters.value.price.max !== null) {
    filtered = filtered.filter(item => {
      const price = parseFloat(item.price)
      if (isNaN(price)) return false
      
      const minCheck = filters.value.price.min === null || price >= filters.value.price.min
      const maxCheck = filters.value.price.max === null || price <= filters.value.price.max
      return minCheck && maxCheck
    })
  }

  // Kilometers range filter
  if (filters.value.kilometers.min !== null || filters.value.kilometers.max !== null) {
    filtered = filtered.filter(item => {
      const km = parseFloat(item.kilometers)
      if (isNaN(km)) return false
      
      const minCheck = filters.value.kilometers.min === null || km >= filters.value.kilometers.min
      const maxCheck = filters.value.kilometers.max === null || km <= filters.value.kilometers.max
      return minCheck && maxCheck
    })
  }

  // Year range filter
  if (filters.value.year.min !== null || filters.value.year.max !== null) {
    filtered = filtered.filter(item => {
      const year = parseFloat(item.year)
      if (isNaN(year)) return false
      
      const minCheck = filters.value.year.min === null || year >= filters.value.year.min
      const maxCheck = filters.value.year.max === null || year <= filters.value.year.max
      return minCheck && maxCheck
    })
  }

  // Sorting
  if (sortBy.value === 'price-asc') {
    filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
  } else if (sortBy.value === 'price-desc') {
    filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
  } else if (sortBy.value === 'year-desc') {
    filtered.sort((a, b) => parseFloat(b.year) - parseFloat(a.year))
  } else if (sortBy.value === 'year-asc') {
    filtered.sort((a, b) => parseFloat(a.year) - parseFloat(b.year))
  } else if (sortBy.value === 'km-asc') {
    filtered.sort((a, b) => parseFloat(a.kilometers) - parseFloat(b.kilometers))
  } else if (sortBy.value === 'km-desc') {
    filtered.sort((a, b) => parseFloat(b.kilometers) - parseFloat(a.kilometers))
  }

  return filtered
})

// Filter toggle functions
const toggleFilter = (filterName) => {
  filterPanelStates.value[filterName] = !filterPanelStates.value[filterName]
}

const toggleBrandFilter = (brand) => {
  const index = filters.value.brand.indexOf(brand)
  if (index > -1) {
    filters.value.brand.splice(index, 1)
  } else {
    filters.value.brand.push(brand)
  }
}

const togglePowerSourceFilter = (powerSource) => {
  const index = filters.value.powerSource.indexOf(powerSource)
  if (index > -1) {
    filters.value.powerSource.splice(index, 1)
  } else {
    filters.value.powerSource.push(powerSource)
  }
}

const toggleSellerFilter = (seller) => {
  const index = filters.value.seller.indexOf(seller)
  if (index > -1) {
    filters.value.seller.splice(index, 1)
  } else {
    filters.value.seller.push(seller)
  }
}

const clearFilters = () => {
  filters.value = {
    brand: [],
    powerSource: [],
    seller: [],
    year: { min: null, max: null },
    price: { min: null, max: null },
    kilometers: { min: null, max: null }
  }
  searchQuery.value = ''
}

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
    <aside class="hidden md:block w-80 bg-black border-r border-gray-900 p-6 text-white min-h-screen overflow-y-auto">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold">Filtra</h2>
        <button 
          @click="clearFilters"
          class="text-sm text-[#A30000] hover:text-red-400 transition-colors"
        >
          Pulisci filtri
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Brand Filter -->
        <div class="border-b border-gray-800 pb-4">
          <div 
            class="flex justify-between items-center cursor-pointer mb-2"
            @click="toggleFilter('brand')"
          >
            <span class="font-medium">Marca</span>
            <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.brand }">+</span>
          </div>
          <div v-show="filterPanelStates.brand" class="space-y-2 mt-3">
            <label 
              v-for="brand in uniqueBrands" 
              :key="brand"
              class="flex items-center space-x-2 text-sm cursor-pointer hover:text-[#A30000] transition-colors"
            >
              <input 
                type="checkbox" 
                :value="brand"
                :checked="filters.brand.includes(brand)"
                @change="toggleBrandFilter(brand)"
                class="rounded border-gray-600 bg-gray-700 text-[#A30000] focus:ring-[#A30000]"
              />
              <span>{{ brand }}</span>
            </label>
          </div>
        </div>

        <!-- Power Source Filter -->
        <div class="border-b border-gray-800 pb-4">
          <div 
            class="flex justify-between items-center cursor-pointer mb-2"
            @click="toggleFilter('powerSource')"
          >
            <span class="font-medium">Carburante</span>
            <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.powerSource }">+</span>
          </div>
          <div v-show="filterPanelStates.powerSource" class="space-y-2 mt-3">
            <label 
              v-for="powerSource in uniquePowerSources" 
              :key="powerSource"
              class="flex items-center space-x-2 text-sm cursor-pointer hover:text-[#A30000] transition-colors"
            >
              <input 
                type="checkbox" 
                :value="powerSource"
                :checked="filters.powerSource.includes(powerSource)"
                @change="togglePowerSourceFilter(powerSource)"
                class="rounded border-gray-600 bg-gray-700 text-[#A30000] focus:ring-[#A30000]"
              />
              <span>{{ powerSource }}</span>
            </label>
          </div>
        </div>

        <!-- Seller Filter -->
        <div class="border-b border-gray-800 pb-4">
          <div 
            class="flex justify-between items-center cursor-pointer mb-2"
            @click="toggleFilter('seller')"
          >
            <span class="font-medium">Venditore</span>
            <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.seller }">+</span>
          </div>
          <div v-show="filterPanelStates.seller" class="space-y-2 mt-3">
            <label 
              v-for="seller in uniqueSellers" 
              :key="seller"
              class="flex items-center space-x-2 text-sm cursor-pointer hover:text-[#A30000] transition-colors"
            >
              <input 
                type="checkbox" 
                :value="seller"
                :checked="filters.seller.includes(seller)"
                @change="toggleSellerFilter(seller)"
                class="rounded border-gray-600 bg-gray-700 text-[#A30000] focus:ring-[#A30000]"
              />
              <span>{{ seller }}</span>
            </label>
          </div>
        </div>

        <!-- Price Filter -->
        <div class="border-b border-gray-800 pb-4">
          <div 
            class="flex justify-between items-center cursor-pointer mb-2"
            @click="toggleFilter('price')"
          >
            <span class="font-medium">Prezzo (€)</span>
            <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.price }">+</span>
          </div>
          <div v-show="filterPanelStates.price" class="space-y-3 mt-3">
            <div class="grid grid-cols-2 gap-2">
              <input 
                v-model.number="filters.price.min"
                type="number" 
                :placeholder="`Min (${priceRange.min})`"
                class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
              />
              <input 
                v-model.number="filters.price.max"
                type="number" 
                :placeholder="`Max (${priceRange.max})`"
                class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
              />
            </div>
          </div>
        </div>

        <!-- Kilometers Filter -->
        <div class="border-b border-gray-800 pb-4">
          <div 
            class="flex justify-between items-center cursor-pointer mb-2"
            @click="toggleFilter('kilometers')"
          >
            <span class="font-medium">Chilometri</span>
            <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.kilometers }">+</span>
          </div>
          <div v-show="filterPanelStates.kilometers" class="space-y-3 mt-3">
            <div class="grid grid-cols-2 gap-2">
              <input 
                v-model.number="filters.kilometers.min"
                type="number" 
                :placeholder="`Min (${kilometersRange.min})`"
                class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
              />
              <input 
                v-model.number="filters.kilometers.max"
                type="number" 
                :placeholder="`Max (${kilometersRange.max})`"
                class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
              />
            </div>
          </div>
        </div>

        <!-- Year Filter -->
        <div class="border-b border-gray-800 pb-4">
          <div 
            class="flex justify-between items-center cursor-pointer mb-2"
            @click="toggleFilter('year')"
          >
            <span class="font-medium">Anno</span>
            <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.year }">+</span>
          </div>
          <div v-show="filterPanelStates.year" class="space-y-3 mt-3">
            <div class="grid grid-cols-2 gap-2">
              <input 
                v-model.number="filters.year.min"
                type="number" 
                :placeholder="`Min (${yearRange.min})`"
                class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
              />
              <input 
                v-model.number="filters.year.max"
                type="number" 
                :placeholder="`Max (${yearRange.max})`"
                class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Top Bar: Search & Sort -->
      <div class="w-full px-4 py-6 flex flex-col md:flex-row md:items-center gap-4 bg-black border-b border-gray-800">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cerca per modello, marca..."
          class="flex-1 bg-[#18181b] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A30000] placeholder-gray-400"
        />
        <div class="flex items-center gap-2">
          <span class="text-white">Ordina</span>
          <select 
            v-model="sortBy"
            class="bg-[#18181b] border border-white/10 text-white text-sm px-4 py-2 pr-8 rounded-lg appearance-none"
          >
            <option value="price-asc">Prezzo crescente</option>
            <option value="price-desc">Prezzo decrescente</option>
            <option value="year-desc">Anno decrescente</option>
            <option value="year-asc">Anno crescente</option>
            <option value="km-asc">Chilometri crescenti</option>
            <option value="km-desc">Chilometri decrescenti</option>
          </select>
        </div>
      </div>
      
      <div class="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div class="mb-4 text-gray-400">{{ filteredItems.length }} veicoli trovati</div>
        <Items :items="filteredItems" v-if="!loading" />
        <LoadingSpinner v-if="loading" />
        <div v-if="!loading && filteredItems.length === 0" class="text-center py-16">
          <p class="text-gray-500 text-lg">Nessuna auto trovata con i filtri selezionati.</p>
          <button 
            @click="clearFilters"
            class="mt-4 text-[#A30000] hover:text-red-400 transition-colors"
          >
            Rimuovi tutti i filtri
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 