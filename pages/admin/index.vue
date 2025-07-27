<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useRoute, useRouter } from 'vue-router'

const items = ref([]);
const loading = ref(true);
const filter = ref('');
const route = useRoute();
const router = useRouter();
const itemsPerPage = 10;

const logout = () => {
  auth.signOut()
  localStorage.removeItem('auth')
  router.push('/login')
}

const getList = async () => {
    try {
        const list = await getDocs(collection(db, 'cars'));
        items.value = list.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (err) {
        console.error('Error loading cars:', err);
    } finally {
        loading.value = false;
    }
}

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this car?')) {
    loading.value = true;
    try {
      await deleteDoc(doc(db, 'cars', id));
      await getList();
    } catch (err) {
      console.error('Error deleting car:', err);
    } finally {
      loading.value = false;
    }
  }
}

// Watch for query param changes and update filter
watch(
  () => route.query.filter,
  (val) => {
    filter.value = val || ''
  },
  { immediate: true }
)

// When filter changes, update the query param
watch(filter, (val) => {
  if ((route.query.filter || '') !== val) {
    router.replace({
      path: route.path,
      query: val ? { ...route.query, filter: val } : { ...route.query, filter: undefined }
    })
  }
})

const filteredItems = computed(() => {
  if (!filter.value) return items.value
  const f = filter.value.toLowerCase()
  return items.value.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(f)
    )
  )
})

const currentPage = computed(() => {
  return parseInt(route.query.page) || 1
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

const goToPage = (page) => {
  router.replace({
    path: route.path,
    query: { ...route.query, page: page > 1 ? page : undefined }
  })
}

onMounted(async () => {
    await getList();
});
</script>

<template>
<div class="min-h-screen bg-gray-50">
  <LoadingSpinner v-if="loading" />
  <template v-else>
    <!-- Header Admin -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <h1 class="text-3xl font-bold text-[#A30000]">Area Riservata</h1>
            <span class="text-gray-500">|</span>
            <span class="text-gray-600">Gestione Veicoli</span>
          </div>
          <button 
            @click="logout" 
            class="bg-[#A30000] hover:bg-red-800 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Search and Filter Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <div class="relative">
              <input
                v-model="filter"
                type="text"
                placeholder="Cerca veicoli..."
                class="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all"
              />
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <NuxtLink v-if="filter" to="/admin" class="text-[#A30000] hover:text-red-800 text-sm font-medium transition-colors">
              Rimuovi filtro
            </NuxtLink>
          </div>
          <NuxtLink 
            to="/admin/new" 
            class="bg-[#A30000] hover:bg-red-800 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Aggiungi Veicolo
          </NuxtLink>
        </div>
      </div>
            </div>
                  </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">Lista Veicoli</h3>
          <p class="text-sm text-gray-600 mt-1">Gestisci tutti i veicoli presenti nel sistema</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immagine</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titolo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anno</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrizione</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedItems" :key="item.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{{ item.id.substring(0, 8) }}...</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="item.images && item.images.length > 0" class="w-[100px] h-auto">
                    <img 
                      :src="item.images[0]" 
                      :alt="item.title"
                      class="w-[100px] h-auto object-cover rounded-lg border border-gray-200 shadow-sm"
                      @error="$event.target.style.display='none'"
                    />
                  </div>
                  <div v-else class="w-[100px] h-[75px] bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.year }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#A30000]/10 text-[#A30000]">
                    {{ item.category }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <div class="truncate" :title="item.description">
                    {{ item.description || 'Nessuna descrizione' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                  <NuxtLink 
                    :to="`/admin/edit/${item.id}`" 
                    class="text-[#A30000] hover:text-red-800 font-medium transition-colors"
                  >
                    Modifica
                  </NuxtLink>
                  <button 
                    @click="handleDelete(item.id)" 
                    class="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a {{ Math.min(currentPage * itemsPerPage, filteredItems.length) }} di {{ filteredItems.length }} risultati
          </div>
          <div class="flex space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
            >
              Precedente
            </button>
            <span v-for="page in totalPages" :key="page">
              <button
                @click="goToPage(page)"
                :class="[
                  'px-4 py-2 text-sm border rounded-lg font-medium transition-colors',
                  currentPage === page 
                    ? 'bg-[#A30000] text-white border-[#A30000] shadow-md' 
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </span>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
            >
              Successivo
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </template>
</div>
</template>

<style scoped>

</style>
