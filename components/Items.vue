<script setup>
import { ref } from 'vue';
import Image from '@/components/Image.vue';

// get items as props
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<template>
    <!-- grid of items in a 3 col responsive grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in items" :key="item.id" class="p-4">
            <NuxtLink :to="`/detail/${item.id}`" class="block">
                <Image :src="item.images[0]" :alt="item.title" class="mb-8"/>
                <div class="info">
                    <h3 class="text-lg font-bold">{{ item.title }}</h3>
                    <p class="text-sm text-gray-500">{{ item.description }}</p>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>

</style>