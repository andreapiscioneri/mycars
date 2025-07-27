<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useRoute, useRouter } from 'vue-router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// Set SEO meta tags
useHead({
  title: t('admin.edit.title'),
  meta: [
    { name: 'description', content: t('admin.edit.meta.description') },
    { name: 'keywords', content: t('admin.edit.meta.keywords') },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: t('admin.edit.meta.ogTitle') },
    { property: 'og:description', content: t('admin.edit.meta.ogDescription') },
    { property: 'og:type', content: 'website' },
  ]
});

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
      error.value = t('admin.edit.carNotFound');
    }
  } catch (err) {
    error.value = t('admin.edit.errorLoading') + ': ' + err.message;
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
      subtitle: formData.subtitle,
      year: formData.year,
      month: formData.month,
      category: formData.category,
      price: formData.price,
      kilometers: formData.kilometers,
      powerSource: formData.powerSource,
      brand: formData.brand,
      seller: formData.seller,
      description: formData.description,
      color: formData.color,
      power: formData.power,
      images: imageUrls
    };
    
    await updateDoc(carDoc, updateData);
    router.push('/admin');
  } catch (err) {
    console.error('Error updating car:', err);
    error.value = t('admin.edit.form.errorPrefix') + err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCar();
});
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Header -->
    <div class="bg-gray-900 shadow-sm border-b border-gray-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center space-x-4">
          <NuxtLink 
            to="/admin" 
            class="text-white hover:text-red-400 transition-colors flex items-center gap-2 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            {{ t('admin.edit.header.backButton') }}
          </NuxtLink>
          <span class="text-gray-400">|</span>
          <h1 class="text-3xl font-bold text-[#A30000]">{{ t('admin.edit.header.title') }}</h1>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="error" class="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-8 text-center">
        <div class="flex flex-col items-center">
          <svg class="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-xl font-semibold text-white mb-2">{{ t('admin.common.error') }}</h2>
          <p class="text-red-400 mb-4">{{ error }}</p>
          <NuxtLink 
            to="/admin" 
            class="bg-[#A30000] hover:bg-red-800 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            {{ t('admin.edit.header.backButton') }}
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="car" class="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <CarForm 
          :initial-data="car" 
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style> 