<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()
</script>

<template>
  <section class="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
    <div class="text-center space-y-8 max-w-2xl">
      <h1 class="text-[100px] md:text-[160px] font-extrabold leading-none text-[#A30000] drop-shadow-lg">
        {{ error.statusCode || 'Errore' }}
      </h1>
      <h2 class="text-3xl md:text-4xl font-semibold">Pagina non trovata</h2>
      <p class="text-white/80 text-lg">
        La pagina che stai cercando non esiste o è stata rimossa.<br />
        Controlla l'URL o torna alla homepage.
      </p>

      <NuxtLink to="/">
        <button class="cursor-pointer bg-[#A30000] hover:bg-red-700 transition px-8 py-4 rounded text-base font-light shadow-md hover:shadow-lg">
          Torna alla Homepage
        </button>
      </NuxtLink>
    </div>
  </section>
</template>
