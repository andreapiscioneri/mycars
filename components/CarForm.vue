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
  year: '',
  category: 'used',
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
      year: newData.year || '',
      category: newData.category || 'used',
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
  <form @submit.prevent="handleSubmit" class="max-w-md mx-auto p-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
        Title
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="year">
        Year
      </label>
      <input
        id="year"
        v-model="formData.year"
        type="number"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
        Category
      </label>
      <select
        id="category"
        v-model="formData.category"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        <option value="used">Used</option>
        <option value="rent">Rent</option>
      </select>
    </div>

    <!-- Images Section -->
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        Images
      </label>
      
      <!-- Upload new image -->
      <div class="mb-4">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          @change="handleFileSelect"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        >
      </div>

      <!-- Existing images list -->
      <div v-if="formData.images.length > 0" class="space-y-2 mb-4">
        <h4 class="text-sm font-semibold text-gray-700">Existing Images</h4>
        <div
          v-for="(image, index) in formData.images"
          :key="`existing-${index}`"
          draggable="true"
          @dragstart="onDragStart($event, index)"
          @dragover="onDragOver"
          @drop="onDrop($event, index)"
          class="flex items-center gap-3 p-3 border rounded bg-gray-50 cursor-move hover:bg-gray-100"
        >
          <img
            :src="image"
            :alt="getFilename(image)"
            class="w-16 h-16 object-cover rounded border"
            @error="$event.target.style.display='none'"
          >
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-600 truncate">{{ getFilename(image) }}</p>
            <p class="text-xs text-gray-400 truncate">{{ image }}</p>
          </div>
          <button
            type="button"
            @click="removeImage(index)"
            class="text-red-600 hover:text-red-800 text-sm font-bold"
          >
            Delete
          </button>
        </div>
        <p class="text-xs text-gray-500 italic">Drag the image items to sort them</p>
      </div>

      <!-- New uploaded files list -->
      <div v-if="uploadedFiles.length > 0" class="space-y-2">
        <h4 class="text-sm font-semibold text-gray-700">New Images to Upload</h4>
        <div
          v-for="(file, index) in uploadedFiles"
          :key="`new-${index}`"
          class="flex items-center gap-3 p-3 border rounded bg-blue-50"
        >
          <img
            v-if="isClient && filePreviewUrls[index]"
            :src="filePreviewUrls[index]"
            :alt="file.name"
            class="w-16 h-16 object-cover rounded border"
          >
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-600 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-400">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
          <button
            type="button"
            @click="removeUploadedFile(index)"
            class="text-red-600 hover:text-red-800 text-sm font-bold"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div v-if="formData.images.length === 0 && uploadedFiles.length === 0" class="text-gray-500 text-sm italic">
        No images added yet
      </div>
    </div>

    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {{ initialData && Object.keys(initialData).length > 0 ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
</style>