<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRoute, useRouter } from 'vue-router';
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute();
const router = useRouter();
const car = ref(null);
const loading = ref(true);
const error = ref(null);

const loadCar = async () => {
  try {
    const carId = route.params.id;
    const carDoc = await getDoc(doc(db, 'cars', carId));
    
    if (carDoc.exists()) {
      car.value = {
        id: carDoc.id,
        ...carDoc.data()
      };
    } else {
      error.value = 'Car not found';
    }
  } catch (err) {
    error.value = 'Error loading car: ' + err.message;
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (formData) => {
  try {
    // update car in firestore
    const carId = route.params.id;
    const carDoc = doc(db, 'cars', carId);
    await updateDoc(carDoc, formData);
    router.push('/admin');
  } catch (err) {
    console.error('Error updating car:', err);
  }
};

onMounted(() => {
  loadCar();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="mb-4">
      <NuxtLink to="/admin" class="text-blue-600 hover:text-blue-800">
        ← Back to Admin
      </NuxtLink>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <NuxtLink to="/admin" class="text-blue-600 hover:text-blue-800 mt-2 inline-block">
        Back to Admin
      </NuxtLink>
    </div>

    <div v-else-if="car">
      <h1 class="text-2xl font-bold mb-6">Edit Car</h1>
      <CarForm 
        :initial-data="car" 
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<style scoped>

</style> 