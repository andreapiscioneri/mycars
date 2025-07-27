<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const formData = ref({
  title: '',
  subtitle: '',
  year: '',
  price: '',
  kilometers: '',
  powerSource: '',
  brand: '',
  seller: '',
  category: 'used',
  description: '',
  images: []
});

const fileInput = ref(null);
const uploadedFiles = ref([]);

const emit = defineEmits(['submit']);

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

// Create preview URLs for uploaded files
const filePreviewUrls = computed(() => {
  if (!isClient) return [];
  return uploadedFiles.value.map(file => URL.createObjectURL(file));
});

// Watch for changes in initialData and update formData
watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    formData.value = {
      title: newData.title || '',
      subtitle: newData.subtitle || '',
      year: newData.year || '',
      category: newData.category || 'used',
      price: newData.price || '',
      kilometers: newData.kilometers || '',
      powerSource: newData.powerSource || '',
      brand: newData.brand || '',
      seller: newData.seller || '',
      description: newData.description || '',
      images: newData.images || []
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', { ...formData.value, uploadedFiles: uploadedFiles.value });
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  uploadedFiles.value.push(...files);
  event.target.value = ''; // Reset input
};

const removeImage = (index) => {
  if (window.confirm('Are you sure you want to delete this image?')) {
    formData.value.images.splice(index, 1);
  }
};

const removeUploadedFile = (index) => {
  if (window.confirm('Are you sure you want to delete this image?')) {
    uploadedFiles.value.splice(index, 1);
  }
};

const getFilename = (url) => {
  try {
    return url.split('/').pop() || url;
  } catch {
    return url;
  }
};

const onDragStart = (e, index) => {
  e.dataTransfer.setData('text/plain', index);
};

const onDragOver = (e) => {
  e.preventDefault();
};

const onDrop = (e, dropIndex) => {
  e.preventDefault();
  const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
  if (dragIndex !== dropIndex) {
    const images = [...formData.value.images];
    const draggedItem = images[dragIndex];
    images.splice(dragIndex, 1);
    images.splice(dropIndex, 0, draggedItem);
    formData.value.images = images;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-4xl mx-auto space-y-8">
    <!-- Basic Information -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Informazioni Generali
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="title">
            Titolo *
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="Es. BMW Serie 3 320d"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="subtitle">
            Sottotitolo
          </label>
          <input
            id="subtitle"
            v-model="formData.subtitle"
            type="text"
            placeholder="Es. Touring Business Advantage"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
           
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="year">
            Anno *
          </label>
          <input
            id="year"
            v-model="formData.year"
            type="number"
            min="1900"
            max="2030"
            placeholder="Es. 2020"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="category">
            Categoria *
          </label>
          <select
            id="category"
            v-model="formData.category"
            class="bg-gray-700 border border-white/10 text-white text-sm px-4 py-2 pr-8 rounded-lg appearance-none w-full"
            required
          >
            <option value="used">Usato</option>
            <option value="rent">Noleggio</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Technical Details -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Dettagli Tecnici
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="price">
            Prezzo (€) *
          </label>
          <input
            id="price"
            v-model="formData.price"
            type="number"
            placeholder="Es. 25000"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="kilometers">
            Chilometri *
          </label>
          <input
            id="kilometers"
            v-model="formData.kilometers"
            type="number"
            placeholder="Es. 50000"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="powerSource">
            Alimentazione *
          </label>
          <input
            id="powerSource"
            v-model="formData.powerSource"
            type="text"
            placeholder="Es. Diesel, Benzina, Elettrica"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="brand">
            Marca *
          </label>
          <input
            id="brand"
            v-model="formData.brand"
            type="text"
            placeholder="Es. BMW, Audi, Mercedes"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
      </div>
      
      <div class="mt-6">
        <label class="block text-gray-300 text-sm font-semibold mb-2" for="seller">
          Venditore
        </label>
        <input
          id="seller"
          v-model="formData.seller"
          type="text"
          placeholder="Nome del venditore"
          class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
          
        >
      </div>
    </div>

    <!-- Description -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
        </svg>
        Descrizione
      </h3>
      
      <textarea
        id="description"
        v-model="formData.description"
        rows="6"
        placeholder="Inserisci una descrizione dettagliata del veicolo, le sue caratteristiche, gli optional inclusi, etc..."
        class="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all resize-none placeholder-gray-400"
      ></textarea>
    </div>

    <!-- Images Section -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        Immagini
      </h3>
      
      <!-- Upload new image -->
      <div class="mb-6">
        <div class="flex items-center justify-center w-full">
          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-300"><span class="font-semibold">Clicca per caricare</span> o trascina qui</p>
              <p class="text-xs text-gray-400">PNG, JPG (MAX. 10MB)</p>
            </div>
            <input
              id="dropzone-file"
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleFileSelect"
              class="hidden"
            />
          </label>
        </div>
      </div>

      <!-- Existing images -->
      <div v-if="formData.images.length > 0" class="mb-6">
        <h4 class="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Immagini Attuali
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in formData.images"
            :key="`existing-${index}`"
            class="relative group bg-gray-700 rounded-lg border border-gray-600 p-2 hover:shadow-md transition-all"
            draggable="true"
            @dragstart="onDragStart($event, index)"
            @dragover="onDragOver"
            @drop="onDrop($event, index)"
          >
            <img
              :src="image"
              :alt="`Immagine ${index + 1}`"
              class="w-full h-24 object-cover rounded border cursor-move"
              @error="$event.target.style.display='none'"
            />
            <button
              type="button"
              @click="removeImage(index)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
            <div class="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </div>

      <!-- New images to upload -->
      <div v-if="uploadedFiles.length > 0" class="mb-6">
        <h4 class="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          Nuove Immagini da Caricare
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="`new-${index}`"
            class="relative group bg-blue-900/20 rounded-lg border border-blue-700 p-2"
          >
            <img
              v-if="isClient && filePreviewUrls[index]"
              :src="filePreviewUrls[index]"
              :alt="file.name"
              class="w-full h-24 object-cover rounded border"
            />
            <div class="mt-2">
              <p class="text-xs text-gray-300 truncate" :title="file.name">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
            </div>
            <button
              type="button"
              @click="removeUploadedFile(index)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="formData.images.length === 0 && uploadedFiles.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-gray-400 text-sm">Nessuna immagine aggiunta</p>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex items-center justify-end space-x-4 pt-6">
      <NuxtLink 
        to="/admin" 
        class="px-6 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors font-medium"
      >
        Annulla
      </NuxtLink>
      <button
        type="submit"
        class="bg-[#A30000] hover:bg-red-800 text-white font-medium py-2 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ initialData && Object.keys(initialData).length > 0 ? 'Aggiorna Veicolo' : 'Crea Veicolo' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
</style>