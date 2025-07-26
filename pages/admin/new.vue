<script setup>
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'vue-router';
import CarForm from '@/components/CarForm.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter();
const loading = ref(false);
const error = ref(null);

const handleSubmit = async (formData) => {
  loading.value = true;
  error.value = null;
  try {
    await addDoc(collection(db, 'cars'), formData);
    router.push('/admin');
  } catch (err) {
    error.value = 'Error creating car: ' + err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="mb-4">
      <NuxtLink to="/admin" class="text-blue-600 hover:text-blue-800">
        ← Back to list
      </NuxtLink>
    </div>
    <h1 class="text-2xl font-bold mb-6">Add New Car</h1>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
    <CarForm @submit="handleSubmit" />
    <LoadingSpinner v-if="loading" />
  </div>
</template>

<style scoped>

</style>