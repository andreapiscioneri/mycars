<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const formData = ref({
  title: '',
  year: ''
});

const emit = defineEmits(['submit']);

// Watch for changes in initialData and update formData
watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    formData.value = {
      title: newData.title || '',
      year: newData.year || ''
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', formData.value);
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