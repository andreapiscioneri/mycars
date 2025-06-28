<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <footer class="bg-black text-white pt-16 px-4">
    <!-- Contattaci + Form -->
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start pb-16 border-b border-gray-700">
      <!-- Contattaci Testo -->
      <div class="space-y-4">
        <h2 class="text-3xl font-extrabold text-[#609BE1]">{{ t('footer.contact_us') }}</h2>
<p class="text-sm text-gray-300 leading-relaxed">
  {{ t('footer.contact_text') }}
</p>
      </div>

      <!-- Form -->
      <div class="space-y-6">
  <h3 class="text-xl font-light">{{ t('footer.form_title') }}</h3>
  <form class="space-y-4">
    <div class="grid sm:grid-cols-2 gap-4">
      <input
        type="text"
        :placeholder="t('footer.first_name')"
        class="bg-black border border-gray-600 px-3 py-2 rounded text-sm w-full text-white"
      />
      <input
        type="text"
        :placeholder="t('footer.last_name')"
        class="bg-black border border-gray-600 px-3 py-2 rounded text-sm w-full text-white"
      />
    </div>
    <div class="grid sm:grid-cols-2 gap-4">
      <input
        type="text"
        :placeholder="t('footer.phone')"
        class="bg-black border border-gray-600 px-3 py-2 rounded text-sm w-full text-white"
      />
      <input
        type="email"
        :placeholder="t('footer.email')"
        class="bg-black border border-gray-600 px-3 py-2 rounded text-sm w-full text-white"
      />
    </div>
    <button class="bg-[#1f2b52] text-white w-full py-2 rounded hover:bg-[#003d8f] transition">
      {{ t('footer.submit') }}
    </button>
  </form>
</div>
    </div>

<!-- Info & Logo -->
<div class="max-w-7xl mx-auto py-12 grid md:grid-cols-3 gap-8 text-sm">
  <!-- Logo -->
  <div>
    <img src="/static/images/site/logo.png" alt="Brennero Gru" class="h-10 mb-4" />
  </div>

  <!-- Info -->
  <div>
    <h4 class="font-bold text-white mb-2">{{ t('footer.info_title') }}</h4>
    <ul>
      <NuxtLink to="/servizi">{{ t('menu.services') }}</NuxtLink><br />
      <NuxtLink to="/usato">{{ t('menu.used') }}</NuxtLink><br />
      <NuxtLink to="/allestimenti">{{ t('menu.fittings') }}</NuxtLink><br />
      <NuxtLink to="/news">{{ t('menu.news') }}</NuxtLink><br />
      <NuxtLink to="/chisiamo">{{ t('menu.about') }}</NuxtLink><br />
      <NuxtLink to="/dovesiamo">{{ t('menu.location') }}</NuxtLink><br />
      <NuxtLink to="/contatti">{{ t('menu.contact') }}</NuxtLink>
    </ul>
  </div>

  <!-- Dove siamo -->
  <div>
    <h4 class="font-bold text-white mb-2">{{ t('footer.where_title') }}</h4>
    <p class="mb-2">Via Lionello Fiumi 22<br />37010 - Cavaion Veronese (VR)</p>
    <p class="mb-1">{{ t('footer.phone2') }}<br />{{ t('footer.fax') }}</p>
        <p>Email: <a href="mailto:info@brennerogru.it" class="hover:underline">info@brennerogru.it</a></p>
      </div>
    </div>



<!-- Social & Footer bar -->
<div class="max-w-7xl mx-auto border-t border-gray-700 pt-6 pb-12 flex flex-col md:flex-row justify-between items-center gap-6">
  <!-- Social -->
  <div class="text-center md:text-left">
    <p class="text-sm text-white">{{ t('footer.follow_us') }}</p>
    <div class="flex items-center gap-4  pt-6 border-b border-white pb-4">
      <a href="https://www.facebook.com/brennerogru/?locale=it_IT" target="_blank" rel="noopener">
        <img src="/static/images/usati/small//fb.png" alt="Facebook" class="w-6 h-6" />
      </a>
      <a href="https://x.com/brennerogru" target="_blank" rel="noopener">
        <img src="/static/images/usati/small/x.png" alt="X (Twitter)" class="w-6 h-6" />
      </a>
      <a href="https://www.instagram.com/explore/locations/410240445682194/brennero-gru/recent/" target="_blank" rel="noopener">
        <img src="/static/images/usati/small/ig.png" alt="Instagram" class="w-6 h-6" />
      </a>
      <a href="https://www.linkedin.com/company/brennero-gru/?originalSubdomain=it" target="_blank" rel="noopener">
        <img src="/static/images/usati/small/link.png" alt="LinkedIn" class="w-6 h-6" />
      </a>
      <a href="https://www.youtube.com/@brennerogru9394" target="_blank" rel="noopener">
        <img src="/static/images/usati/small/yt.png" alt="YouTube" class="w-6 h-6" />
      </a>
    </div>
  </div>

<!-- Copyright -->
<div class="text-xs text-gray-400 text-center md:text-center space-y-2">
  <p>Copyright © 2023 BRENNERO GRU.it</p>
  <div class="flex justify-center md:justify-center gap-4 text-center">
    <NuxtLink to="/cookie" class="hover:underline">{{ t('footer.cookie') }}</NuxtLink>
    <NuxtLink to="/privacy" class="hover:underline">{{ t('footer.privacy') }}</NuxtLink>
    <NuxtLink to="/termini" class="hover:underline">{{ t('footer.terms') }}</NuxtLink>
  </div>
</div>

  <!-- Certificazioni -->
  <div class="text-center md:text-right">
    <img src="/static/images/site/icons.png" alt="Certificazioni" class="h-6" />
  </div>
</div>

  </footer>
</template>
