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
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">{{ categoryLabel }}</h1>
    <LoadingSpinner v-if="loading" />
    <Items :items="items" v-if="!loading" />
    
    <!-- Show message if no items found -->
    <div v-if="!loading && items.length === 0" class="text-center py-8">
      <p class="text-gray-500">Nessuna auto trovata in questa categoria.</p>
    </div>
  </div>
</template> 