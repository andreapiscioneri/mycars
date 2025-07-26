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
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.id }}</td>
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
