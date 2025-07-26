<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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

const uploadImages = async (files) => {
  const uploadPromises = files.map(async (file) => {
    try {
      const imageRef = storageRef(storage, `cars/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Upload error:', error);
      if (error.code === 'storage/unauthorized') {
        throw new Error('Upload failed: Please make sure you are logged in and have permission to upload files.');
      } else if (error.message.includes('CORS')) {
        throw new Error('Upload failed: CORS configuration issue. Please contact the administrator.');
      } else {
        throw new Error(`Upload failed: ${error.message}`);
      }
    }
  });
  
  return await Promise.all(uploadPromises);
};

const handleSubmit = async (formData) => {
  try {
    loading.value = true;
    let imageUrls = [...formData.images]; // Keep existing images
    
    // Upload new files if any
    if (formData.uploadedFiles && formData.uploadedFiles.length > 0) {
      const newImageUrls = await uploadImages(formData.uploadedFiles);
      imageUrls = [...imageUrls, ...newImageUrls];
    }
    
    // Update car document with image URLs
    const carId = route.params.id;
    const carDoc = doc(db, 'cars', carId);
    const updateData = {
      title: formData.title,
      year: formData.year,
      category: formData.category,
      description: formData.description,
      images: imageUrls
    };
    
    await updateDoc(carDoc, updateData);
    router.push('/admin');
  } catch (err) {
    console.error('Error updating car:', err);
    error.value = 'Error updating car: ' + err.message;
  } finally {
    loading.value = false;
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