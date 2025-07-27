<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const route = useRoute()
const router = useRouter()
const car = ref(null)
const selectedImage = ref('')
const loading = ref(true)
const relatedCars = ref([])

const scrollContainer = ref(null)
const thumbContainer = ref(null)

// Modal for image zoom
const isModalOpen = ref(false)
const modalImage = ref('')
const openModal = () => {
  modalImage.value = selectedImage.value
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

const scrollRelated = (direction) => {
  const container = scrollContainer.value
  if (!container) return
  container.scrollLeft += direction === 'left' ? -320 : 320
}

const scrollThumbs = (dir) => {
  const el = thumbContainer.value
  if (!el) return
  el.scrollLeft += dir === 'left' ? -120 : 120
}

// Get category label
const categoryLabel = computed(() => {
  if (!car.value) return ''
  return car.value.category === 'used' ? 'Auto Usata' : 'Auto a Noleggio'
})

// Get back link
const backLink = computed(() => {
  if (!car.value) return '/list/used'
  return `/list/${car.value.category}`
})

onMounted(async () => {
  try {
    const carId = route.params.id
    const carDoc = doc(db, 'cars', carId)
    const carSnap = await getDoc(carDoc)

    if (!carSnap.exists()) {
      router.push('/404')
      return
    }

    car.value = {
      id: carSnap.id,
      ...carSnap.data()
    }

    selectedImage.value = car.value.images?.[0] || '/placeholder.jpg'

    // Load related cars from the same category
    const { collection, getDocs, query, where, limit } = await import('firebase/firestore')
    const carsQuery = query(
      collection(db, 'cars'),
      where('category', '==', car.value.category),
      limit(6)
    )
    const relatedSnapshot = await getDocs(carsQuery)
    relatedCars.value = relatedSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(c => c.id !== car.value.id)

    // Set page meta
    useHead({
      title: `${car.value.title} | ${categoryLabel.value} - MyCars`,
      meta: [
        {
          name: 'description',
          content: car.value.description || `Scopri ${car.value.title} - anno ${car.value.year}, categoria ${car.value.category}.`
        },
        {
          name: 'keywords',
          content: car.value.category === 'used' 
            ? 'auto usate Bergamo, auto in vendita, occasioni auto usate, veicoli garantiti'
            : 'noleggio auto Bergamo, auto a noleggio, affitto auto, noleggio breve termine',
        },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: `${car.value.title} | ${categoryLabel.value} - MyCars` },
        {
          property: 'og:description',
          content: car.value.description || `Scopri ${car.value.title} - anno ${car.value.year}, categoria ${car.value.category}.`,
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `https://www.mycarsbergamo.it/detail/${car.value.id}` },
      ],
      link: [
        { rel: 'canonical', href: `https://www.mycarsbergamo.it/detail/${car.value.id}` }
      ]
    })
  } catch (error) {
    console.error('Error loading car:', error)
    router.push('/404')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="bg-black text-white py-20 px-4 md:px-10 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>

      <!-- Car detail -->
      <div v-else-if="car" class="grid md:grid-cols-2 gap-10 mb-20">
        <!-- Image gallery -->
        <div>
          <div class="relative">
            <img
              :src="selectedImage || '/placeholder.jpg'"
              alt="Immagine principale"
              class="w-full h-auto rounded-xl shadow-xl object-contain bg-black border border-white/10 cursor-pointer"
              @click="openModal"
            />
          </div>

          <!-- Thumbnails -->
          <div v-if="car.images && car.images.length > 1" class="relative mt-4">
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
                v-for="(img, i) in car.images"
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

        <!-- Car info -->
        <div class="bg-white/5 rounded-xl p-6 space-y-6">
          <div>
            <h1 class="text-3xl font-bold">{{ car.title }}</h1>
            <p class="text-white/70 text-sm mt-2">{{ categoryLabel }}</p>
          </div>

          <ul class="space-y-2 text-sm divide-y divide-white/10">
            <li class="flex justify-between pt-2">
              <span>Anno:</span>
              <span>{{ car.year || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span>Categoria:</span>
              <span>{{ car.category === 'used' ? 'Usato' : 'Noleggio' }}</span>
            </li>
            <li class="text-xl font-bold text-white border border-white bg-green-900/10 px-4 py-2 rounded w-fit">
              <span>{{ car.price ? `€ ${car.price.toLocaleString()}` : 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span>Potenza:</span>
              <span>{{ car.power || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span>Colore:</span>
              <span>{{ car.color || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span>Chilometraggio:</span>
              <span>{{ car.kilometers ? `${car.kilometers.toLocaleString()} km` : 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span>Fonte di alimentazione:</span>
              <span>{{ car.powerSource || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span>Marca:</span>
              <span>{{ car.brand || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span>Venditore:</span>
              <span>{{ car.seller || 'n.d.' }}</span>
            </li>
          </ul>

          <div v-if="car.description" class="pt-6 text-sm text-white/90 leading-relaxed">
            <span class="font-semibold">Descrizione:</span>
            <p class="mt-2">{{ car.description }}</p>
          </div>

          <div class="flex flex-wrap gap-3 pt-6">
            <NuxtLink :to="backLink" class="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded text-sm shadow">
              ← Torna indietro
            </NuxtLink>
            <a
              :href="`mailto:info@mycarsbergamo.com?subject=Richiesta%20informazioni%20su%20${car.title}`"
              class="bg-[#A30000] hover:bg-red-700 text-white px-5 py-2 rounded text-sm shadow"
            >
              Contattaci
            </a>
          </div>
        </div>
      </div>

      <!-- Related cars -->
      <div v-if="relatedCars.length > 0">
        <h2 class="text-3xl font-bold text-center text-red-700 mb-10">
          <span class="text-white">Veicoli</span> correlati
        </h2>

        <div class="relative">
          <button
            @click="scrollRelated('left')"
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
              v-for="relatedCar in relatedCars"
              :key="relatedCar.id"
              class="min-w-[300px] max-w-[300px] bg-white/10 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <NuxtLink
                :to="`/detail/${relatedCar.id}`"
                class="block"
              >
                <img
                  :src="relatedCar.images?.[0] || '/placeholder.jpg'"
                  class="w-full h-48 object-cover"
                  alt="Immagine veicolo"
                />
                <div class="p-4 text-center">
                  <h3 class="font-bold text-white">
                    {{ relatedCar.title }}
                  </h3>
                  <p class="text-sm text-white/70 mt-1">{{ relatedCar.year }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <button
            @click="scrollRelated('right')"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded z-10"
          >
            &gt;
          </button>
        </div>
      </div>

      <!-- Image modal -->
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