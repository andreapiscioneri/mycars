<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Redirect to used cars by default
  router.push('/list/used');
});
</script>

<template>
  <div class="container mx-auto p-4">
    <p>Reindirizzamento...</p>
  </div>
</template>