<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Redirect to admin index since edit requires an ID
  router.push('/admin');
});
</script>

<template>
  <div class="container mx-auto p-4 text-center">
    <p>Redirecting to admin...</p>
  </div>
</template>

<style scoped>

</style>