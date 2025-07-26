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
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="item in items"
      :key="item.id"
      class="bg-black rounded-xl shadow-lg border border-gray-800 flex flex-col overflow-hidden hover:shadow-2xl hover:border-[#A30000] transition-all duration-300"
    >
      <NuxtLink :to="`/detail/${item.id}`" class="block">
        <div class="w-full h-48 bg-black flex items-center justify-center overflow-hidden">
          <Image :src="item.images[0]" :alt="item.title" class="object-cover w-full h-full" />
        </div>
        <div class="p-5 flex flex-col flex-1">
          <h3 class="text-lg font-bold text-white mb-1">{{ item.title }}</h3>
          <div class="text-sm text-gray-300 mb-2">{{ item.subtitle || item.title }}</div>
          <div class="text-xs text-gray-400 space-y-1 mb-4">
            <div v-if="item.year">Anno: <span class="text-white">{{ item.year }}</span></div>
            <div v-if="item.kilometers">Chilometri: <span class="text-white">{{ item.kilometers }} km</span></div>
            <div v-if="item.price">Prezzo: <span class="text-white">{{ item.price }} €</span></div>
            <div v-if="item.seller">Venditore: <span class="text-white">{{ item.seller }}</span></div>
          </div>
          <NuxtLink :to="`/detail/${item.id}`" class="mt-auto block w-full">
            <button class="w-full bg-[#A30000] hover:bg-red-700 text-white font-semibold py-2 rounded transition">Dettagli</button>
          </NuxtLink>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
</style>