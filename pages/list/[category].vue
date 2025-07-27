<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
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
  year: false,
  mobileFilters: false
})

// Get category from URL parameter
const category = computed(() => route.params.category)

// Validate category
const validCategories = ['used', 'rent']
const isValidCategory = computed(() => validCategories.includes(category.value))

// Count active filters
const activeFiltersCount = computed(() => {
  let count = 0
  
  // Count array filters
  count += filters.value.brand.length
  count += filters.value.powerSource.length
  count += filters.value.seller.length
  
  // Count range filters
  if (filters.value.price.min !== null || filters.value.price.max !== null) count++
  if (filters.value.kilometers.min !== null || filters.value.kilometers.max !== null) count++
  if (filters.value.year.min !== null || filters.value.year.max !== null) count++
  
  // Count search query
  if (searchQuery.value.trim()) count++
  
  return count
})

// Set page title and meta based on category
const pageTitle = computed(() => {
  if (category.value === 'used') return t('category.titles.used')
  if (category.value === 'rent') return t('category.titles.rent')
  return t('category.titles.default')
})

const pageDescription = computed(() => {
  if (category.value === 'used') return t('category.descriptions.used')
  if (category.value === 'rent') return t('category.descriptions.rent')
  return t('category.descriptions.default')
})

const categoryLabel = computed(() => {
  if (category.value === 'used') return t('category.labels.used')
  if (category.value === 'rent') return t('category.labels.rent')
  return t('category.labels.default')
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

// Computed placeholders for translations
const pricePlaceholders = computed(() => ({
  min: t('category.filters.minPlaceholder', { min: priceRange.value.min }),
  max: t('category.filters.maxPlaceholder', { max: priceRange.value.max })
}))

const kilometerPlaceholders = computed(() => ({
  min: t('category.filters.minPlaceholder', { min: kilometersRange.value.min }),
  max: t('category.filters.maxPlaceholder', { max: kilometersRange.value.max })
}))

const yearPlaceholders = computed(() => ({
  min: t('category.filters.minPlaceholder', { min: yearRange.value.min }),
  max: t('category.filters.maxPlaceholder', { max: yearRange.value.max })
}))

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

// Set page metadata
useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <div class="flex min-h-screen bg-black lg:flex-row-reverse">
    <!-- Mobile Filter Toggle Button -->
    <div 
      v-if="!filterPanelStates.mobileFilters"
      class="lg:hidden fixed bottom-20 right-6 z-50"
    >
      <button
        class="bg-[#A30000] hover:bg-red-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center relative"
        @click="toggleFilter('mobileFilters')"
        :aria-label="filterPanelStates.mobileFilters ? 'Chiudi filtri' : 'Apri filtri'"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
        </svg>
        
        <!-- Badge per contatore filtri attivi -->
        <div 
          v-if="activeFiltersCount > 0" 
          class="absolute -top-2 -right-2 bg-white text-[#A30000] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
        >
          {{ activeFiltersCount }}
        </div>
      </button>
    </div>

    <!-- Mobile Filter Overlay -->
    <div
      v-if="filterPanelStates.mobileFilters"
      class="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="toggleFilter('mobileFilters')"
    ></div>

    <!-- Sidebar Filter -->
    <aside 
      :class="[
        'bg-black border-l border-gray-900 text-white min-h-screen overflow-y-auto transition-transform duration-300 z-40',
        'lg:block lg:w-80 lg:static lg:translate-x-0 lg:order-2 lg:border-l-0 lg:border-r lg:border-gray-900',
        filterPanelStates.mobileFilters 
          ? 'fixed inset-y-0 right-0 w-80 translate-x-0' 
          : 'fixed inset-y-0 right-0 w-80 translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="p-4 lg:p-6">
        <!-- Header with title and actions -->
        <div class="flex justify-between items-center mb-6 lg:mb-8 sticky top-0 bg-black pb-4 border-b border-gray-800 lg:border-b-0">
          <h2 class="text-xl lg:text-2xl font-bold">{{ t('category.filters.title') }}</h2>
          <div class="flex items-center gap-3">
            <button 
              @click="clearFilters"
              class="text-sm text-[#A30000] hover:text-red-400 transition-colors px-2 py-1"
            >
              {{ t('category.filters.clearAll') }}
            </button>
            <button
              @click="toggleFilter('mobileFilters')"
              class="lg:hidden text-white hover:text-[#A30000] text-2xl p-1"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div class="space-y-4">
          <!-- Brand Filter -->
          <div class="border-b border-gray-800 pb-4">
            <div 
              class="flex justify-between items-center cursor-pointer mb-2"
              @click="toggleFilter('brand')"
            >
              <span class="font-medium">{{ t('category.filters.brand') }}</span>
              <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.brand }">+</span>
            </div>
            <div v-show="filterPanelStates.brand" class="space-y-2 mt-3 max-h-40 overflow-y-auto">
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
              <span class="font-medium">{{ t('category.filters.powerSource') }}</span>
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
              <span class="font-medium">{{ t('category.filters.seller') }}</span>
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
              <span class="font-medium">{{ t('category.filters.price') }}</span>
              <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.price }">+</span>
            </div>
            <div v-show="filterPanelStates.price" class="space-y-3 mt-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input 
                  v-model.number="filters.price.min"
                  type="number" 
                  :placeholder="pricePlaceholders.min"
                  class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
                />
                <input 
                  v-model.number="filters.price.max"
                  type="number" 
                  :placeholder="pricePlaceholders.max"
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
              <span class="font-medium">{{ t('category.filters.kilometers') }}</span>
              <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.kilometers }">+</span>
            </div>
            <div v-show="filterPanelStates.kilometers" class="space-y-3 mt-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input 
                  v-model.number="filters.kilometers.min"
                  type="number" 
                  :placeholder="kilometerPlaceholders.min"
                  class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
                />
                <input 
                  v-model.number="filters.kilometers.max"
                  type="number" 
                  :placeholder="kilometerPlaceholders.max"
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
              <span class="font-medium">{{ t('category.filters.year') }}</span>
              <span class="text-2xl transition-transform" :class="{ 'rotate-45': filterPanelStates.year }">+</span>
            </div>
            <div v-show="filterPanelStates.year" class="space-y-3 mt-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input 
                  v-model.number="filters.year.min"
                  type="number" 
                  :placeholder="yearPlaceholders.min"
                  class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
                />
                <input 
                  v-model.number="filters.year.max"
                  type="number" 
                  :placeholder="yearPlaceholders.max"
                  class="w-full px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A30000]"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Apply filters button for mobile -->
        <div class="lg:hidden sticky bottom-0 bg-black border-t border-gray-800 pt-4 mt-6">
          <button
            @click="toggleFilter('mobileFilters')"
            class="w-full bg-[#A30000] hover:bg-red-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {{ t('category.filters.showResults', { count: filteredItems.length }) }}
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Top Bar: Search & Sort -->
      <div class="w-full px-4 lg:px-6 py-4 lg:py-6 bg-black border-b border-gray-800 sticky top-0 z-30">
        <div class="flex flex-col gap-4">
          <!-- Search bar -->
          <div class="flex gap-2">
            <!-- Mobile filter button in header -->
            <button
              class="lg:hidden bg-[#A30000] hover:bg-red-800 text-white px-4 py-3 rounded-lg flex items-center gap-2 text-sm relative"
              @click="toggleFilter('mobileFilters')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
              </svg>
              <span>{{ t('category.filters.title') }}</span>
              <div 
                v-if="activeFiltersCount > 0" 
                class="absolute -top-1 -right-1 bg-white text-[#A30000] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ activeFiltersCount }}
              </div>
            </button>
            
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('category.search.placeholder')"
              class="flex-1 bg-[#18181b] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A30000] placeholder-gray-400 text-sm lg:text-base"
            />
          </div>
          
          <!-- Sort and results count -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="text-gray-400 text-sm lg:text-base">
              {{ t('category.search.resultsCount', { count: filteredItems.length }) }}
            </div>
            <div class="flex items-center gap-2">
              <span class="text-white text-sm lg:text-base">{{ t('category.sorting.label') }}</span>
              <select 
                v-model="sortBy"
                class="bg-[#18181b] border border-white/10 text-white text-sm px-3 py-2 lg:px-4 lg:py-3 pr-8 rounded-lg appearance-none min-w-0"
              >
                <option value="price-asc">{{ t('category.sorting.priceAsc') }}</option>
                <option value="price-desc">{{ t('category.sorting.priceDesc') }}</option>
                <option value="year-desc">{{ t('category.sorting.yearDesc') }}</option>
                <option value="year-asc">{{ t('category.sorting.yearAsc') }}</option>
                <option value="km-asc">{{ t('category.sorting.kmAsc') }}</option>
                <option value="km-desc">{{ t('category.sorting.kmDesc') }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <Items :items="filteredItems" v-if="!loading" />
        <LoadingSpinner v-if="loading" />
        <div v-if="!loading && filteredItems.length === 0" class="text-center py-12 lg:py-16">
          <p class="text-gray-500 text-base lg:text-lg mb-4">{{ t('category.search.noResults') }}</p>
          <button 
            @click="clearFilters"
            class="text-[#A30000] hover:text-red-400 transition-colors text-sm lg:text-base"
          >
            {{ t('category.search.removeFilters') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 