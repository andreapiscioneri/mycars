<script setup lang="ts">
import { ref } from 'vue'

const showHours = ref(false)
</script>

<template>
  <footer class="bg-black text-white pt-16 px-4">
    <!-- Contattaci + Form -->
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start pb-16 border-b border-gray-800">
      <div class="space-y-4">
        <h2 class="text-3xl font-extrabold text-[#A30000]">Contattaci</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Compila il modulo per ricevere informazioni.
        </p>
      </div>

      <div class="space-y-6">
        <h3 class="text-xl font-light text-gray-200">Scrivici un messaggio</h3>
        <form class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Nome" class="bg-black border border-gray-700 px-3 py-2 rounded text-sm w-full text-white placeholder-gray-400" />
            <input type="text" placeholder="Cognome" class="bg-black border border-gray-700 px-3 py-2 rounded text-sm w-full text-white placeholder-gray-400" />
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Telefono" class="bg-black border border-gray-700 px-3 py-2 rounded text-sm w-full text-white placeholder-gray-400" />
            <input type="email" placeholder="Email" class="bg-black border border-gray-700 px-3 py-2 rounded text-sm w-full text-white placeholder-gray-400" />
          </div>
          <button class="bg-[#A30000] text-white w-full py-2 rounded hover:bg-red-800 transition">Invia</button>
        </form>
      </div>
    </div>

    <!-- Info & Logo -->
    <div class="max-w-7xl mx-auto py-12 grid md:grid-cols-3 gap-8 text-sm text-gray-300">
      <!-- Logo -->
      <div>
        <img src="/static/images/mycarslogo.png" alt="MyCars Logo" class="h-10 mb-4" />
      </div>

      <!-- Info -->
      <div>
        <h4 class="font-bold text-white mb-2">Informazioni</h4>
        <ul>
          <NuxtLink to="/servizi" class="hover:text-[#A30000]">Servizi</NuxtLink><br />
          <NuxtLink to="/usato" class="hover:text-[#A30000]">Veicoli</NuxtLink><br />
          <NuxtLink to="/chisiamo" class="hover:text-[#A30000]">Chi siamo</NuxtLink><br />
          <NuxtLink to="/dovesiamo" class="hover:text-[#A30000]">Dove siamo</NuxtLink><br />
          <NuxtLink to="/contatti" class="hover:text-[#A30000]">Contatti</NuxtLink>
        </ul>
      </div>

      <!-- Dove siamo -->
      <div>
        <h4 class="font-bold text-white mb-2">Dove siamo</h4>
        <p class="mb-2"><strong>Indirizzo:</strong> Via dei Livelli di Sopra, 24060 Costa di Mezzate BG</p>
        <p class="mb-2"><strong>Telefono:</strong> <a href="tel:3803850700" class="text-[#609BE1] hover:text-[#A30000]">380 385 0700</a></p>

        <!-- Accordion Orari -->
        <div>
          <button @click="showHours = !showHours" class="w-full text-left font-bold text-white flex justify-between items-center mt-4 hover:text-[#A30000] transition">
            Orari di apertura
            <span class="text-lg">{{ showHours ? '–' : '+' }}</span>
          </button>

          <transition name="fade" mode="out-in">
            <div v-if="showHours" class="mt-2 text-sm text-gray-400 pl-2 space-y-1" key="open">
              <p>domenica — <span class="text-white">Chiuso</span></p>
              <p>lunedì — <span class="text-white">09:00–17:30</span></p>
              <p>martedì — <span class="text-white">09:00–17:30</span></p>
              <p>mercoledì — <span class="text-white">09:00–17:30</span></p>
              <p>giovedì — <span class="text-white">09:00–17:30</span></p>
              <p>venerdì — <span class="text-white">09:00–17:30</span></p>
              <p>sabato — <span class="text-white">Chiuso</span></p>
            </div>
          </transition>

        </div>

        <p class="mt-4"><strong>Provincia:</strong> Provincia di Bergamo</p>
      </div>
    </div>

    <!-- Social & Footer bar -->
    <div class="max-w-7xl mx-auto border-t border-gray-800 pt-6 pb-12 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="text-center md:text-left">
        <p class="text-sm text-white">Seguici sui social</p>
        <div class="flex items-center gap-4 pt-6 border-b border-white pb-4">
          <a href="#"><img src="/static/icons/fb.png" alt="Facebook" class="w-6 h-6" /></a>
          <a href="#"><img src="/static/icons/x.png" alt="X" class="w-6 h-6" /></a>
          <a href="#"><img src="/static/icons/ig.png" alt="Instagram" class="w-6 h-6" /></a>
          <a href="#"><img src="/static/icons/link.png" alt="LinkedIn" class="w-6 h-6" /></a>
          <a href="#"><img src="/static/icons/yt.png" alt="YouTube" class="w-6 h-6" /></a>
        </div>
      </div>

      <div class="text-xs text-gray-500 text-center space-y-2">
        <p>© {{ new Date().getFullYear() }} MyCars. Tutti i diritti riservati.</p>
        <div class="flex gap-4 justify-center">
          <NuxtLink to="/cookie" class="hover:text-[#A30000]">Cookie Policy</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-[#A30000]">Privacy</NuxtLink>
          <NuxtLink to="/termini" class="hover:text-[#A30000]">Termini</NuxtLink>
        </div>
      </div>

      <div class="text-center md:text-right">
        <img src="/static/images/mycarslogo.png" alt="Certificazioni" class="h-6" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
