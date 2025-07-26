<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRoute, useRouter } from 'vue-router';

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
    // Here you would typically update the document in Firestore
    console.log('Updating car with data:', formData);
    // For now, just log the data
    // You can implement the update logic here
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

    <div v-if="loading" class="text-center py-8">
      <p>Loading...</p>
    </div>

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