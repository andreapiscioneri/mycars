<script setup>
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useRouter } from 'vue-router';
import CarForm from '@/components/CarForm.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

// Set SEO meta tags
useHead({
  title: t('admin.new.title'),
  meta: [
    { name: 'description', content: t('admin.new.meta.description') },
    { name: 'keywords', content: t('admin.new.meta.keywords') },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: t('admin.new.meta.ogTitle') },
    { property: 'og:description', content: t('admin.new.meta.ogDescription') },
    { property: 'og:type', content: 'website' },
  ]
});

const loading = ref(false);
const error = ref('');

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
  error.value = '';
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
    
    await addDoc(collection(db, 'cars'), carData);
    router.push('/admin');
  } catch (err) {
    error.value = t('admin.new.form.errorPrefix') + err.message;
  } finally {
    loading.value = false;
  }
};
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
            {{ t('admin.new.header.backButton') }}
          </NuxtLink>
          <span class="text-gray-400">|</span>
          <h1 class="text-3xl font-bold text-[#A30000]">{{ t('admin.new.header.title') }}</h1>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <div v-if="error" class="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-red-300 font-medium">{{ error }}</span>
          </div>
        </div>
        <CarForm @submit="handleSubmit" />
        <LoadingSpinner v-if="loading" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>