<template>
  <div class="flex flex-col items-center justify-center py-8">
    <svg class="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    <p class="text-white">{{ $t('loading') }}</p>
  </div>
</template>

<script setup>
// No script needed for this simple spinner
</script>

<style scoped>
</style> 