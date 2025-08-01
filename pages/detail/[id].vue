<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useCarTranslations } from '@/composables/useCarTranslations'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { translatePowerSource, translateSeller } = useCarTranslations()
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
  return car.value.category === 'used' ? t('detail.category.used') : t('detail.category.rent')
})

// Get back link
const backLink = computed(() => {
  if (!car.value) return '/list/used'
  return `/list/${car.value.category}`
})

// Generate email URL with translations
const emailUrl = computed(() => {
  if (!car.value) return 'mailto:info@mycarsbergamo.it'
  const subject = t('detail.actions.emailSubject', { title: car.value.title })
  const body = t('detail.actions.emailBody', { title: car.value.title })
  return `mailto:info@mycarsbergamo.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})

// Meta data for SEO
const pageTitle = computed(() => {
  if (!car.value) return 'MyCars'
  return `${car.value.title} | ${categoryLabel.value} - MyCars`
})

const pageDescription = computed(() => {
  if (!car.value) return 'MyCars Bergamo'
  return car.value.description || `Scopri ${car.value.title} - anno ${car.value.year}, categoria ${car.value.category}.`
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
      title: pageTitle,
      meta: [
        {
          name: 'description',
          content: pageDescription
        },
        {
          name: 'keywords',
          content: car.value.category === 'used' 
            ? 'auto usate Bergamo, auto in vendita, occasioni auto usate, veicoli garantiti'
            : 'noleggio auto Bergamo, auto a noleggio, affitto auto, noleggio breve termine',
        },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: pageTitle },
        {
          property: 'og:description',
          content: pageDescription,
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hide scrollbar for webkit browsers */
::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<template>
  <section class="bg-black text-white py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-10 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-red-600"></div>
      </div>

      <!-- Car detail -->
      <div v-else-if="car" class="space-y-8 lg:space-y-12">
        <!-- Back button -->
        <div>
          <NuxtLink 
            :to="backLink" 
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            {{ t('detail.backToList') }}
          </NuxtLink>
        </div>

        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Image gallery -->
          <div class="space-y-4">
            <div class="relative">
              <img
                :src="selectedImage || '/placeholder.jpg'"
                :alt="t('detail.imageModal.mainImageAlt')"
                class="w-full h-64 sm:h-80 lg:h-96 rounded-xl shadow-xl object-cover bg-black border border-white/10 cursor-pointer"
                @click="openModal"
              />
              <!-- Zoom indicator -->
              <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                </svg>
              </div>
            </div>

            <!-- Thumbnails -->
            <div v-if="car.images && car.images.length > 1" class="relative">
              <button
                v-if="car.images.length > 4"
                @click="scrollThumbs('left')"
                class="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full z-10 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <div
                ref="thumbContainer"
                class="flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth px-0 sm:px-8"
                style="scrollbar-width: none; -ms-overflow-style: none;"
              >
                <img
                  v-for="(img, i) in car.images"
                  :key="i"
                  :src="img"
                  @click="selectedImage = img"
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover cursor-pointer border-2 shrink-0 transition-all duration-300"
                  :class="{
                    'border-[#A30000] ring-2 ring-[#A30000]/50': selectedImage === img,
                    'border-transparent opacity-70 hover:opacity-100 hover:border-white/30': selectedImage !== img
                  }"
                />
              </div>

              <button
                v-if="car.images.length > 4"
                @click="scrollThumbs('right')"
                class="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full z-10 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Car info -->
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 lg:p-8 space-y-6 lg:space-y-8 border border-white/10">
            <!-- Header -->
            <div class="space-y-2">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{{ car.title }}</h1>
              <div class="flex items-center gap-2">
                <span class="inline-block bg-[#A30000] text-white text-xs px-2 py-1 rounded-full">
                  {{ categoryLabel }}
                </span>
                <span class="text-white/70 text-sm">{{ car.subtitle || car.brand }}</span>
              </div>
            </div>

            <!-- Price highlight -->
            <div v-if="car.price" class="bg-gradient-to-r from-[#A30000]/20 to-transparent border border-[#A30000]/30 rounded-xl p-4 lg:p-6">
              <div class="text-center lg:text-left">
                <p class="text-sm text-white/70 mb-1">{{ t('detail.vehicleInfo.price') }}</p>
                <p class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  € {{ Number(car.price).toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- Details grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div v-if="car.year" class="bg-white/5 rounded-lg p-3 lg:p-4">
                <p class="text-xs text-white/60 mb-1">{{ t('detail.vehicleInfo.year') }}</p>
                <p class="text-lg font-semibold">{{ car.year }}</p>
              </div>
              <div v-if="car.kilometers" class="bg-white/5 rounded-lg p-3 lg:p-4">
                <p class="text-xs text-white/60 mb-1">{{ t('detail.vehicleInfo.kilometers') }}</p>
                <p class="text-lg font-semibold">{{ Number(car.kilometers).toLocaleString() }} km</p>
              </div>
              <div v-if="car.powerSource" class="bg-white/5 rounded-lg p-3 lg:p-4">
                <p class="text-xs text-white/60 mb-1">{{ t('detail.vehicleInfo.fuel') }}</p>
                <p class="text-lg font-semibold">{{ translatePowerSource(car.powerSource) }}</p>
              </div>
              <div v-if="car.power" class="bg-white/5 rounded-lg p-3 lg:p-4">
                <p class="text-xs text-white/60 mb-1">{{ t('detail.vehicleInfo.power') }}</p>
                <p class="text-lg font-semibold">{{ car.power }}</p>
              </div>
              <div v-if="car.color" class="bg-white/5 rounded-lg p-3 lg:p-4">
                <p class="text-xs text-white/60 mb-1">{{ t('detail.vehicleInfo.color') }}</p>
                <p class="text-lg font-semibold">{{ car.color }}</p>
              </div>
              <div v-if="car.brand" class="bg-white/5 rounded-lg p-3 lg:p-4">
                <p class="text-xs text-white/60 mb-1">{{ t('detail.vehicleInfo.brand') }}</p>
                <p class="text-lg font-semibold">{{ car.brand }}</p>
              </div>
            </div>

            <!-- Description -->
            <!-- TODO: Riattivare la sezione descrizione quando necessario -->
            <!-- <div v-if="car.description" class="bg-white/5 rounded-lg p-4 lg:p-6">
              <h3 class="font-semibold text-lg mb-3">{{ t('detail.vehicleInfo.description') }}</h3>
              <p class="text-sm sm:text-base text-white/90 leading-relaxed">{{ car.description }}</p>
            </div> -->

            <!-- Actions -->
            <div class="flex flex-col gap-3 pt-6">
              <a
                :href="emailUrl"
                class="w-full bg-[#A30000] hover:bg-red-700 text-white text-center px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {{ t('detail.actions.requestInfo') }}
              </a>
              <a
                href="tel:3803850700"
                class="w-full bg-white/10 hover:bg-white/20 text-white text-center px-6 py-4 rounded-lg font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:scale-[1.02]"
              >
                {{ t('detail.actions.callNow') }}
              </a>
            </div>
          </div>
        </div>

        <!-- Related cars -->
        <div v-if="relatedCars.length > 0" class="pt-8 lg:pt-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
            <span class="text-white">{{ t('detail.relatedCars.title').split(' ')[0] }}</span>&nbsp;
            <span class="text-[#A30000]">{{ t('detail.relatedCars.title').split(' ')[1] }}</span>
          </h2>

          <div class="relative">
            <button
              v-if="relatedCars.length > 1"
              @click="scrollRelated('left')"
              class="absolute left-0 top-1/2 -translate-y-1/2 bg-[#A30000] hover:bg-red-800 text-white p-3 rounded-full z-10 transition-all duration-300 shadow-lg hidden sm:block"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <div
              ref="scrollContainer"
              class="flex gap-4 lg:gap-6 overflow-x-auto scroll-smooth pb-4 px-0 sm:px-12"
              style="scrollbar-width: none; -ms-overflow-style: none;"
            >
              <div
                v-for="relatedCar in relatedCars"
                :key="relatedCar.id"
                class="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] bg-white/10 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/10 hover:border-[#A30000]/50"
              >
                <NuxtLink
                  :to="`/detail/${relatedCar.id}`"
                  class="block group"
                >
                  <div class="relative overflow-hidden">
                    <img
                      :src="relatedCar.images?.[0] || '/placeholder.jpg'"
                      class="w-full h-48 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-110"
                      :alt="t('detail.relatedCars.imageAlt')"
                    />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                  <div class="p-4 lg:p-5">
                    <h3 class="font-bold text-white text-lg mb-1 line-clamp-2">
                      {{ relatedCar.title }}
                    </h3>
                    <div class="flex justify-between items-center text-sm text-white/70 mb-2">
                      <span>{{ relatedCar.year || t('detail.vehicleInfo.notAvailable') }}</span>
                      <span>{{ relatedCar.kilometers ? `${Number(relatedCar.kilometers).toLocaleString()} km` : t('detail.vehicleInfo.notAvailable') }}</span>
                    </div>
                    <div v-if="relatedCar.price" class="bg-gradient-to-r from-[#A30000]/20 to-transparent border border-[#A30000]/30 rounded-xl p-4 lg:p-2">
                      € {{ Number(relatedCar.price).toLocaleString() }}
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <button
              v-if="relatedCars.length > 1"
              @click="scrollRelated('right')"
              class="absolute right-0 top-1/2 -translate-y-1/2 bg-[#A30000] hover:bg-red-800 text-white p-3 rounded-full z-10 transition-all duration-300 shadow-lg hidden sm:block"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Image modal -->
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeModal"
      >
        <div class="relative w-full max-w-5xl mx-auto" @click.stop>
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-white text-2xl bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 rounded-full z-50 transition-all duration-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <img
            :src="modalImage"
            :alt="t('detail.imageModal.zoomedImageAlt')"
            class="w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
</template> 