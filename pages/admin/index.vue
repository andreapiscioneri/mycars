<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useRoute, useRouter } from 'vue-router'

const items = ref([]);
const loading = ref(true);
const filter = ref('');
const route = useRoute();
const router = useRouter();
const itemsPerPage = 10;

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
<div class="container mx-auto p-4">
  <LoadingSpinner v-if="loading" />
  <template v-else>
    <h1 class="text-2xl font-bold mb-6">Cars</h1>
    <div class="flex items-center mb-4 gap-4">
      <input
        v-model="filter"
        type="text"
        placeholder="Filter cars..."
        class="border rounded px-3 py-2 w-64"
      />
      <NuxtLink v-if="filter" to="/admin" class="text-blue-600 hover:underline text-sm">Reset filter</NuxtLink>
    </div>
    <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="item in paginatedItems" :key="item.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div v-if="item.images && item.images.length > 0" class="w-[100px] h-auto">
              <img 
                :src="item.images[0]" 
                :alt="item.title"
                class="w-[100px] h-auto object-cover rounded border"
                @error="$event.target.style.display='none'"
              />
            </div>
            <div v-else class="w-[100px] h-[75px] bg-gray-300 rounded border flex items-center justify-center">
              <span class="text-gray-500 text-sm">No image</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.title }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.year }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.category }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <NuxtLink :to="`/admin/edit/${item.id}`" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</NuxtLink>
            <button @click="handleDelete(item.id)" class="text-red-600 hover:text-red-800">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredItems.length) }} of {{ filteredItems.length }} results
      </div>
      <div class="flex space-x-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <span v-for="page in totalPages" :key="page">
          <button
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 text-sm border rounded',
              currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
    
    <div class="mt-6">
      <NuxtLink to="/admin/new" class="inline-block bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
        + Add New Car
      </NuxtLink>
    </div>
  </template>
</div>
</template>

<style scoped>

</style>
