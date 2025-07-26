<script setup>
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useRouter } from 'vue-router';
import CarForm from '@/components/CarForm.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter();
const loading = ref(false);
const error = ref(null);

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
  loading.value = true;
  error.value = null;
  try {
    let imageUrls = [...formData.images]; // Keep existing images
    
    // Upload new files if any
    if (formData.uploadedFiles && formData.uploadedFiles.length > 0) {
      const newImageUrls = await uploadImages(formData.uploadedFiles);
      imageUrls = [...imageUrls, ...newImageUrls];
    }
    
    // Create car document with image URLs
    const carData = {
      title: formData.title,
      year: formData.year,
      category: formData.category,
      description: formData.description,
      images: imageUrls
    };
    
    await addDoc(collection(db, 'cars'), carData);
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
        ← Back to Admin
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