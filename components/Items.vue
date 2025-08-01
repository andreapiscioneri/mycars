<script setup>
import { ref } from 'vue';
import Image from '@/components/Image.vue';
import { useCarTranslations } from '@/composables/useCarTranslations';

const { translatePowerSource, translateSeller, translateColor } = useCarTranslations();

// get items as props
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
    <div
      v-for="item in items"
      :key="item.id"
      class="bg-black rounded-xl shadow-lg border border-gray-800 flex flex-col overflow-hidden hover:shadow-2xl hover:border-[#A30000] transition-all duration-300 transform hover:scale-[1.02]"
    >
      <NuxtLink :to="`/detail/${item.id}`" class="block">
        <div class="w-full h-48 sm:h-52 lg:h-48 bg-black flex items-center justify-center overflow-hidden">
          <Image :src="item.images[0]" :alt="item.title" class="object-cover w-full h-full transition-transform duration-300 hover:scale-110" />
        </div>
        <div class="p-4 sm:p-5 flex flex-col flex-1">
          <h3 class="text-base sm:text-lg font-bold text-white mb-1 line-clamp-2 leading-tight">{{ item.title }}</h3>
          <div class="text-sm text-gray-300 mb-2 sm:mb-3 line-clamp-1">{{ item.subtitle || item.title }}</div>
          
          <div class="text-xs sm:text-sm text-gray-400 space-y-1 mb-4 flex-1">
            <div v-if="item.year" class="flex justify-between">
              <span>{{ $t('items.year') }}:</span>
              <span class="text-white font-medium">{{ item.year }}</span>
            </div>
            <div v-if="item.kilometers" class="flex justify-between">
              <span>{{ $t('items.kilometers') }}:</span>
              <span class="text-white font-medium">{{ Number(item.kilometers).toLocaleString() }} km</span>
            </div>
            <div v-if="item.seller" class="flex justify-between">
              <span>{{ $t('items.seller') }}:</span>
              <span class="text-white font-medium text-xs">{{ translateSeller(item.seller) }}</span>
            </div>
            <div v-if="item.powerSource" class="flex justify-between">
              <span>{{ $t('items.powerSource') }}:</span>
              <span class="text-white font-medium text-xs">{{ translatePowerSource(item.powerSource) }}</span>
            </div>
            <div v-if="item.price" class="flex justify-between">
              <span>{{ $t('items.price') }}:</span>
              <span class="text-white font-bold text-xl ">€ {{ Number(item.price).toLocaleString() }}</span>
            </div>
          </div>
          
          <NuxtLink :to="`/detail/${item.id}`" class="mt-auto block w-full">
            <button class="w-full bg-[#A30000] hover:bg-red-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base">
              {{ $t('items.details') }}
            </button>
          </NuxtLink>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>