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
  month: '',
  price: '',
  kilometers: '',
  powerSource: '',
  brand: '',
  seller: '',
  category: 'used',
  description: '',
  color: '',
  power: '',
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
      month: newData.month || '',
      category: newData.category || 'used',
      price: newData.price || '',
      kilometers: newData.kilometers || '',
      powerSource: newData.powerSource || '',
      brand: newData.brand || '',
      seller: newData.seller || '',
      description: newData.description || '',
      color: newData.color || '',
      power: newData.power || '',
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
  if (window.confirm($t('carForm.images.deleteConfirm'))) {
    formData.value.images.splice(index, 1);
  }
};

const removeUploadedFile = (index) => {
  if (window.confirm($t('carForm.images.deleteConfirm'))) {
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

const onDragStartUploaded = (e, index) => {
  e.dataTransfer.setData('text/plain', index);
  e.dataTransfer.setData('source', 'uploaded');
};

const onDropUploaded = (e, dropIndex) => {
  e.preventDefault();
  const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
  const source = e.dataTransfer.getData('source');
  
  if (source === 'uploaded' && dragIndex !== dropIndex) {
    const files = [...uploadedFiles.value];
    const draggedItem = files[dragIndex];
    files.splice(dragIndex, 1);
    files.splice(dropIndex, 0, draggedItem);
    uploadedFiles.value = files;
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
        {{ $t('carForm.sections.generalInfo') }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="title">
            {{ $t('carForm.fields.title.label') }} *
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            :placeholder="$t('carForm.fields.title.placeholder')"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="subtitle">
            {{ $t('carForm.fields.subtitle.label') }}
          </label>
          <input
            id="subtitle"
            v-model="formData.subtitle"
            type="text"
            :placeholder="$t('carForm.fields.subtitle.placeholder')"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
           
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="year">
            {{ $t('carForm.fields.year.label') }} *
          </label>
          <input
            id="year"
            v-model="formData.year"
            type="number"
            min="1900"
            max="2030"
            :placeholder="$t('carForm.fields.year.placeholder')"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="month">
            {{ $t('carForm.fields.month.label') }} *
          </label>
          <select
            id="month"
            v-model="formData.month"
            class="bg-gray-700 border border-gray-600 text-white text-sm px-4 py-2 pr-8 rounded-lg appearance-none w-full focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all"
            required
          >
            <option value="">{{ $t('carForm.fields.month.placeholder') }}</option>
            <option value="01">{{ $t('carForm.fields.month.options.01') }}</option>
            <option value="02">{{ $t('carForm.fields.month.options.02') }}</option>
            <option value="03">{{ $t('carForm.fields.month.options.03') }}</option>
            <option value="04">{{ $t('carForm.fields.month.options.04') }}</option>
            <option value="05">{{ $t('carForm.fields.month.options.05') }}</option>
            <option value="06">{{ $t('carForm.fields.month.options.06') }}</option>
            <option value="07">{{ $t('carForm.fields.month.options.07') }}</option>
            <option value="08">{{ $t('carForm.fields.month.options.08') }}</option>
            <option value="09">{{ $t('carForm.fields.month.options.09') }}</option>
            <option value="10">{{ $t('carForm.fields.month.options.10') }}</option>
            <option value="11">{{ $t('carForm.fields.month.options.11') }}</option>
            <option value="12">{{ $t('carForm.fields.month.options.12') }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="category">
            {{ $t('carForm.fields.category.label') }} *
          </label>
          <select
            id="category"
            v-model="formData.category"
            class="bg-gray-700 border border-white/10 text-white text-sm px-4 py-2 pr-8 rounded-lg appearance-none w-full"
            required
          >
            <option value="used">{{ $t('carForm.fields.category.options.used') }}</option>
            <option value="rent">{{ $t('carForm.fields.category.options.rent') }}</option>
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
        {{ $t('carForm.sections.technicalDetails') }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="price">
            {{ $t('carForm.fields.price.label') }} *
          </label>
          <input
            id="price"
            v-model="formData.price"
            type="number"
            :placeholder="$t('carForm.fields.price.placeholder')"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="kilometers">
            {{ $t('carForm.fields.kilometers.label') }} *
          </label>
          <input
            id="kilometers"
            v-model="formData.kilometers"
            type="number"
            :placeholder="$t('carForm.fields.kilometers.placeholder')"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="powerSource">
            {{ $t('carForm.fields.powerSource.label') }} *
          </label>
          <select
            id="powerSource"
            v-model="formData.powerSource"
            class="bg-gray-700 border border-gray-600 text-white text-sm px-4 py-2 pr-8 rounded-lg appearance-none w-full focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all"
            required
          >
            <option value="">{{ $t('carForm.fields.powerSource.placeholder') }}</option>
            <option value="benzina">{{ $t('category.values.powerSource.benzina') }}</option>
            <option value="diesel">{{ $t('category.values.powerSource.diesel') }}</option>
            <option value="gpl">{{ $t('category.values.powerSource.gpl') }}</option>
            <option value="metano">{{ $t('category.values.powerSource.metano') }}</option>
            <option value="elettrica">{{ $t('category.values.powerSource.elettrica') }}</option>
            <option value="ibrida">{{ $t('category.values.powerSource.ibrida') }}</option>
            <option value="plug-in">{{ $t('category.values.powerSource.plug-in') }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="brand">
            {{ $t('carForm.fields.brand.label') }} *
          </label>
          <input
            id="brand"
            v-model="formData.brand"
            type="text"
            :placeholder="$t('carForm.fields.brand.placeholder')"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
            required
          >
        </div>

        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="color">
            {{ $t('carForm.fields.color.label') }}
          </label>
          <select
            id="color"
            v-model="formData.color"
            class="bg-gray-700 border border-gray-600 text-white text-sm px-4 py-2 pr-8 rounded-lg appearance-none w-full focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all"
          >
            <option value="">{{ $t('carForm.fields.color.placeholder') }}</option>
            
            <!-- Colori base -->
            <optgroup :label="$t('carForm.fields.color.groups.base')">
              <option value="nero">{{ $t('category.values.color.nero') }}</option>
              <option value="bianco">{{ $t('category.values.color.bianco') }}</option>
              <option value="grigio">{{ $t('category.values.color.grigio') }}</option>
              <option value="argento">{{ $t('category.values.color.argento') }}</option>
            </optgroup>
            
            <!-- Rossi -->
            <optgroup :label="$t('carForm.fields.color.groups.red')">
              <option value="rosso">{{ $t('category.values.color.rosso') }}</option>
              <option value="bordeaux">{{ $t('category.values.color.bordeaux') }}</option>
            </optgroup>
            
            <!-- Blu -->
            <optgroup :label="$t('carForm.fields.color.groups.blue')">
              <option value="blu">{{ $t('category.values.color.blu') }}</option>
              <option value="blu-scuro">{{ $t('category.values.color.blu-scuro') }}</option>
              <option value="blu-chiaro">{{ $t('category.values.color.blu-chiaro') }}</option>
              <option value="blu-metallizzato">{{ $t('category.values.color.blu-metallizzato') }}</option>
              <option value="azzurro">{{ $t('category.values.color.azzurro') }}</option>
              <option value="celeste">{{ $t('category.values.color.celeste') }}</option>
              <option value="navy">{{ $t('category.values.color.navy') }}</option>
              <option value="petrolio">{{ $t('category.values.color.petrolio') }}</option>
              <option value="turchese">{{ $t('category.values.color.turchese') }}</option>
            </optgroup>
            
            <!-- Verdi -->
            <optgroup :label="$t('carForm.fields.color.groups.green')">
              <option value="verde">{{ $t('category.values.color.verde') }}</option>
              <option value="verde-scuro">{{ $t('category.values.color.verde-scuro') }}</option>
              <option value="verde-chiaro">{{ $t('category.values.color.verde-chiaro') }}</option>
              <option value="verde-metallizzato">{{ $t('category.values.color.verde-metallizzato') }}</option>
            </optgroup>
            
            <!-- Gialli e Arancioni -->
            <optgroup :label="$t('carForm.fields.color.groups.yellow')">
              <option value="giallo">{{ $t('category.values.color.giallo') }}</option>
              <option value="giallo-limone">{{ $t('category.values.color.giallo-limone') }}</option>
              <option value="arancione">{{ $t('category.values.color.arancione') }}</option>
              <option value="oro">{{ $t('category.values.color.oro') }}</option>
            </optgroup>
            
            <!-- Marroni e Beige -->
            <optgroup :label="$t('carForm.fields.color.groups.brown')">
              <option value="marrone">{{ $t('category.values.color.marrone') }}</option>
              <option value="marrone-scuro">{{ $t('category.values.color.marrone-scuro') }}</option>
              <option value="marrone-chiaro">{{ $t('category.values.color.marrone-chiaro') }}</option>
              <option value="beige">{{ $t('category.values.color.beige') }}</option>
              <option value="champagne">{{ $t('category.values.color.champagne') }}</option>
              <option value="crema">{{ $t('category.values.color.crema') }}</option>
              <option value="avorio">{{ $t('category.values.color.avorio') }}</option>
            </optgroup>
            
            <!-- Rosa e Viola -->
            <optgroup :label="$t('carForm.fields.color.groups.pink')">
              <option value="rosa">{{ $t('category.values.color.rosa') }}</option>
              <option value="fucsia">{{ $t('category.values.color.fucsia') }}</option>
              <option value="magenta">{{ $t('category.values.color.magenta') }}</option>
              <option value="viola">{{ $t('category.values.color.viola') }}</option>
              <option value="violetto">{{ $t('category.values.color.violetto') }}</option>
            </optgroup>
            
            <!-- Metallizzati e Speciali -->
            <optgroup :label="$t('carForm.fields.color.groups.metallic')">
              <option value="nero-metallizzato">{{ $t('category.values.color.nero-metallizzato') }}</option>
              <option value="nero-opaco">{{ $t('category.values.color.nero-opaco') }}</option>
              <option value="bianco-perla">{{ $t('category.values.color.bianco-perla') }}</option>
              <option value="bianco-ghiaccio">{{ $t('category.values.color.bianco-ghiaccio') }}</option>
              <option value="grigio-metallizzato">{{ $t('category.values.color.grigio-metallizzato') }}</option>
              <option value="grigio-chiaro">{{ $t('category.values.color.grigio-chiaro') }}</option>
              <option value="grigio-scuro">{{ $t('category.values.color.grigio-scuro') }}</option>
              <option value="argento-metallizzato">{{ $t('category.values.color.argento-metallizzato') }}</option>
              <option value="titanio">{{ $t('category.values.color.titanio') }}</option>
              <option value="perla">{{ $t('category.values.color.perla') }}</option>
              <option value="bronze">{{ $t('category.values.color.bronze') }}</option>
              <option value="bronzo">{{ $t('category.values.color.bronzo') }}</option>
              <option value="antracite">{{ $t('category.values.color.antracite') }}</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2" for="power">
            {{ $t('carForm.fields.power.label') }}
          </label>
          <input
            id="power"
            v-model="formData.power"
            type="text"
            :placeholder="$t('carForm.fields.power.placeholder')"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all placeholder-gray-400"
          >
        </div>
      </div>
      
      <div class="mt-6">
        <label class="block text-gray-300 text-sm font-semibold mb-2" for="seller">
          {{ $t('carForm.fields.seller.label') }}
        </label>
        <select
          id="seller"
          v-model="formData.seller"
          class="bg-gray-700 border border-gray-600 text-white text-sm px-4 py-2 pr-8 rounded-lg appearance-none w-full focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all"
        >
          <option value="">{{ $t('carForm.fields.seller.placeholder') }}</option>
          <option value="rivenditore">{{ $t('category.values.seller.rivenditore') }}</option>
          <option value="privato">{{ $t('category.values.seller.privato') }}</option>
          <option value="concessionaria">{{ $t('category.values.seller.concessionaria') }}</option>
          <option value="azienda">{{ $t('category.values.seller.azienda') }}</option>
        </select>
      </div>
    </div>

    <!-- Description -->
    <!-- TODO: Riattivare la sezione descrizione quando necessario -->
    <!-- <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
        </svg>
        {{ $t('carForm.sections.description') }}
      </h3>
      
      <textarea
        id="description"
        v-model="formData.description"
        rows="6"
        :placeholder="$t('carForm.fields.description.placeholder')"
        class="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A30000] focus:border-transparent transition-all resize-none placeholder-gray-400"
      ></textarea>
    </div> -->

    <!-- Images Section -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-[#A30000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        {{ $t('carForm.sections.images') }}
      </h3>
      
      <!-- Upload new image -->
      <div class="mb-6">
        <div class="flex items-center justify-center w-full">
          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-300"><span class="font-semibold">{{ $t('carForm.images.upload.title') }}</span> {{ $t('carForm.images.upload.subtitle') }}</p>
              <p class="text-xs text-gray-400">{{ $t('carForm.images.upload.formats') }}</p>
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
          {{ $t('carForm.images.existing.title') }}
          <span class="text-xs text-gray-400 font-normal">{{ $t('carForm.images.existing.subtitle') }}</span>
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in formData.images"
            :key="`existing-${index}`"
            class="relative group bg-gray-700 rounded-lg border border-gray-600 p-2 hover:shadow-md transition-all cursor-move"
            draggable="true"
            @dragstart="onDragStart($event, index)"
            @dragover="onDragOver"
            @drop="onDrop($event, index)"
          >
            <img
              :src="image"
              :alt="`Immagine ${index + 1}`"
              class="w-full h-24 object-cover rounded border"
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
            <div class="absolute top-1 left-1 bg-green-500 bg-opacity-75 text-white text-xs px-1 rounded flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
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
          {{ $t('carForm.images.new.title') }}
          <span class="text-xs text-gray-400 font-normal">{{ $t('carForm.images.new.subtitle') }}</span>
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="`new-${index}`"
            class="relative group bg-blue-900/20 rounded-lg border border-blue-700 p-2 hover:shadow-md transition-all cursor-move"
            draggable="true"
            @dragstart="onDragStartUploaded($event, index)"
            @dragover="onDragOver"
            @drop="onDropUploaded($event, index)"
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
            <div class="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {{ index + 1 }}
            </div>
            <div class="absolute top-1 left-1 bg-blue-500 bg-opacity-75 text-white text-xs px-1 rounded flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="formData.images.length === 0 && uploadedFiles.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-gray-400 text-sm">{{ $t('carForm.images.noImages') }}</p>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex items-center justify-end space-x-4 pt-6">
      <NuxtLink 
        to="/admin" 
        class="px-6 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors font-medium"
      >
        {{ $t('carForm.actions.cancel') }}
      </NuxtLink>
      <button
        type="submit"
        class="bg-[#A30000] hover:bg-red-800 text-white font-medium py-2 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ initialData && Object.keys(initialData).length > 0 ? $t('carForm.actions.update') : $t('carForm.actions.create') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
</style>