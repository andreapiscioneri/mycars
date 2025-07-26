<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const items = ref([]);
const loading = ref(true);

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

onMounted(async () => {
    await getList();
});
</script>

<template>
<div class="container mx-auto p-4">
  <LoadingSpinner v-if="loading" />
  
  <template v-else>
    <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.title }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.year }}</td>
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
