<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const items = ref([]);

const getList = async () => {
    const list = await getDocs(collection(db, 'cars'));
    items.value = list.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    console.log(items.value);
}  

onMounted(async () => {
    await getList();
});
</script>

<template>
<div class="container mx-auto p-4">
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
          <NuxtLink :to="`/admin/edit/${item.id}`" class="text-indigo-600 hover:text-indigo-900">Edit</NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<style scoped>

</style>
