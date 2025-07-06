<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'

const route = useRoute()
const router = useRouter()
const veicolo = ref(null)
const selectedImage = ref('')
const loading = ref(true)
const correlati = ref([])

const scrollContainer = ref(null)
const thumbContainer = ref(null)

const isModalOpen = ref(false)
const modalImage = ref('')
const openModal = () => {
  modalImage.value = selectedImage.value
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

const slugify = (str) =>
  str.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')

const scrollCorrelati = (direction) => {
  const container = scrollContainer.value
  if (!container) return
  container.scrollLeft += direction === 'left' ? -320 : 320
}

const scrollThumbs = (dir) => {
  const el = thumbContainer.value
  if (!el) return
  el.scrollLeft += dir === 'left' ? -120 : 120
}

onMounted(async () => {
  const res = await fetch('/api/veicoli')
  const data = await res.json()

  veicolo.value = data.find(v => `${slugify(v.titolo)}-${v.codice}` === route.params.slug)

  if (!veicolo.value) {
    router.push('/404')
    return
  }

  selectedImage.value = veicolo.value.immagine || veicolo.value.galleria?.[0] || '/placeholder.jpg'

  correlati.value = data.filter(v => v.codice !== veicolo.value.codice && v.tipo === 'noleggio')

  useHead({
    title: `${veicolo.value.titolo} | Veicolo a Noleggio`,
    meta: [
      {
        name: 'description',
        content: `Scopri ${veicolo.value.titolo} - ${veicolo.value.marca} ${veicolo.value.modello}, alimentazione ${veicolo.value.carburante}, carrozzeria ${veicolo.value.carrozzeria}, venduto da ${veicolo.value.venditore}.`
      }
    ]
  })

  loading.value = false
})
</script>

<template>
  <section class="bg-black text-white py-20 px-4 md:px-10 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Dettaglio veicolo -->
      <div v-if="veicolo" class="grid md:grid-cols-2 gap-10 mb-20">
        <!-- Galleria -->
        <div>
          <div class="relative">
            <img
              :src="selectedImage || '/placeholder.jpg'"
              alt="Immagine principale"
              class="w-full h-auto rounded-xl shadow-xl object-contain bg-black border border-white/10 cursor-pointer"
              @click="openModal"
            />
          </div>

          <!-- Miniature -->
          <div class="relative mt-4">
            <button
              @click="scrollThumbs('left')"
              class="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-full z-10"
            >‹</button>

            <div
              ref="thumbContainer"
              class="flex gap-3 overflow-x-auto scroll-smooth px-8"
              style="scrollbar-width: none;"
            >
              <img
                v-for="(img, i) in [veicolo.immagine, ...veicolo.galleria]"
                :key="i"
                :src="img"
                @click="selectedImage = img"
                class="w-20 h-20 rounded object-cover cursor-pointer border-2 shrink-0"
                :class="{
                  'border-[#A30000]': selectedImage === img,
                  'border-transparent opacity-80 hover:opacity-100': selectedImage !== img
                }"
              />
            </div>

            <button
              @click="scrollThumbs('right')"
              class="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-full z-10"
            >›</button>
          </div>
        </div>

        <!-- Info veicolo -->
        <div class="bg-white/5 rounded-xl p-6 space-y-6">
          <h1 class="text-3xl font-bold">{{ veicolo.titolo }}</h1>
          <p class="text-white/70 text-sm">{{ veicolo.marca }} {{ veicolo.modello }}</p>

          <p class="text-xl font-bold text-white border border-white bg-green-900/10 px-4 py-2 rounded w-fit">
            {{ veicolo.prezzo ? veicolo.prezzo + ' €' : 'Prezzo non disponibile' }}
          </p>

          <ul class="space-y-2 text-sm divide-y divide-white/10">
            <li class="flex justify-between pt-2"><span>Anno:</span><span>{{ veicolo.anno || 'n.d.' }}</span></li>
            <li class="flex justify-between pt-2"><span>Chilometri:</span><span>{{ veicolo.chilometri ? veicolo.chilometri + ' km' : 'n.d.' }}</span></li>
            <li class="flex justify-between pt-2"><span>Carrozzeria:</span><span>{{ veicolo.carrozzeria || 'n.d.' }}</span></li>
            <li class="flex justify-between pt-2"><span>Carburante:</span><span>{{ veicolo.carburante || 'n.d.' }}</span></li>
            <li class="flex justify-between pt-2"><span>Venditore:</span><span>{{ veicolo.venditore || 'n.d.' }}</span></li>
          </ul>
       <div v-if="veicolo.descrizione" class="pt-6 text-sm text-white/90 leading-relaxed"><span>Descrizione:</span>
            {{ veicolo.descrizione }}
          </div>

          <div class="flex flex-wrap gap-3 pt-6">
            <NuxtLink to="/noleggio" class="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded text-sm shadow">
              ← Torna indietro
            </NuxtLink>
            <a
              :href="`mailto:info@mycarsbergamo.com?subject=Richiesta%20informazioni%20su%20${veicolo.titolo}`"
              class="bg-[#A30000] hover:bg-red-700 text-white px-5 py-2 rounded text-sm shadow"
            >
              Contattaci
            </a>
          </div>
        </div>
      </div>

      <!-- Correlati -->
      <div v-if="correlati.length">
        <h2 class="text-3xl font-bold text-center text-red-700 mb-10">
          <span class="text-white">Veicoli</span> correlati
        </h2>

        <div class="relative">
          <button
            @click="scrollCorrelati('left')"
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded z-10"
          >
            &lt;
          </button>

          <div
            ref="scrollContainer"
            class="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-10"
            style="scrollbar-width: none;"
          >
            <div
              v-for="(auto, i) in correlati"
              :key="i"
              class="min-w-[300px] max-w-[300px] bg-white/10 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <NuxtLink
                :to="`/noleggio/${slugify(auto.titolo)}-${auto.codice}`"
                class="block"
              >
                <img
                  :src="auto.immagine || auto.galleria?.[0] || '/placeholder.jpg'"
                  class="w-full h-48 object-cover"
                  alt="Immagine veicolo"
                />
                <div class="p-4 text-center">
                  <h3 class="font-bold text-white">
                    {{ auto.titolo }} {{ auto.marca }}
                  </h3>
                </div>
              </NuxtLink>
            </div>
          </div>

          <button
            @click="scrollCorrelati('right')"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded z-10"
          >
            &gt;
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div class="relative w-full max-w-5xl mx-auto">
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-white text-2xl bg-black/50 hover:bg-black/70 px-3 py-1 rounded-full z-50"
          >
            ✕
          </button>
          <img
            :src="modalImage"
            alt="Immagine zoomata"
            class="w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>
</template>
