<script setup lang="ts">
const mezzateMapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.139195481139!2d9.774582312863232!3d45.66274542066452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47814d4ea629b88d%3A0x5949ed7e5b6e4724!2sVia%20dei%20Livelli%20di%20Sopra%2C%2024060%20Costa%20di%20Mezzate%20BG!5e0!3m2!1sit!2sit!4v1749632701234!5m2!1sit!2sit";
</script>

<template>
  <section class="w-full px-4 md:px-10 py-16 bg-black text-white pb-40 ">
    <div class="w-full max-w-none grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
      <!-- Testo -->
      <div class="p-6 md:p-12">
        <h2 class="text-3xl font-extrabold text-[#A30000] mb-4">Costa di Mezzate</h2>

        <p class="text-base font-medium leading-relaxed">
          Via dei Livelli di Sopra<br />
          24060 - Costa di Mezzate (BG)
        </p>

        <!-- Telefono -->
        <p class="text-base flex items-center gap-2 mt-4">
          <a href="tel:+393803850700" class="hover:underline text-white">+39 380 385 0700</a>
          <img src="/public/static/images/telefono.png" alt="Icona telefono" class="w-4 h-4" />
        </p>

        <!-- Email -->
        <p class="text-base flex items-center gap-2 mt-2">
          <a href="mailto:info@maycars.it" class="hover:underline text-white">info@maycars.it</a>
          <img src="/public/static/images/mailblack.png" alt="Icona email" class="w-4 h-3" />
        </p>

        <!-- Orari di apertura -->
        <div class="mt-4 text-sm leading-relaxed">
          <p><span class="font-semibold text-[#A30000]">Orari:</span></p>
          <ul class="mt-1 space-y-1">
            <li>Lunedì – Venerdì: 09:00 – 12:30 / 14:30 – 19:00</li>
            <li>Sabato: 09:00 – 12:30</li>
            <li>Domenica: Chiuso</li>
          </ul>
        </div>

        <div class="border-t-2 border-[#A30000] mt-6 w-full"></div>
      </div>

      <!-- Mappa -->
      <div class="w-full h-[350px] md:h-[500px]">
        <iframe
          :src="mezzateMapSrc"
          width="100%"
          height="100%"
          style="border:0;"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="rounded-none"
        ></iframe>
      </div>
    </div>
  </section>
</template>
