<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'
import { NuxtLink } from '#components'

const route = useRoute()
const router = useRouter()
const veicolo = ref(null)
const loading = ref(true)

onMounted(async () => {
  const res = await fetch('/api/veicoli')
  const data = await res.json()
  veicolo.value = data.find(v => v.codice === route.params.codice)

  if (!veicolo.value) {
    router.push('/404')
    return
  }

  useHead({
    title: `${veicolo.value.titolo} | Veicolo Usato`,
    meta: [
      {
        name: 'description',
        content: `Scopri il veicolo ${veicolo.value.titolo} - ${veicolo.value.modello}, alimentazione ${veicolo.value.carburante}, carrozzeria ${veicolo.value.carrozzeria}, disponibile da ${veicolo.value.dealer}.`
      }
    ]
  })

  loading.value = false
})
</script>

<template>
  <section class="bg-black text-white py-20 px-4 md:px-10 min-h-screen">
    <div class="max-w-6xl mx-auto space-y-10">
      <div v-if="loading" class="text-center text-white/50 text-sm">Caricamento...</div>

      <div v-else-if="veicolo" class="grid md:grid-cols-2 gap-10 items-start">
        <!-- Galleria -->
        <div>
          <img
            :src="veicolo.immagine || '/placeholder.jpg'"
            alt="Immagine veicolo"
            class="w-full h-auto rounded-xl shadow-lg object-cover"
          />
          <!-- Thumbnails future -->
          <!-- <div class="flex gap-2 mt-3">
            <img
              v-for="i in 3"
              :key="i"
              src="/placeholder.jpg"
              class="w-16 h-16 object-cover rounded-lg border border-white/10 hover:border-white cursor-pointer"
            />
          </div> -->
        </div>

        <!-- Info veicolo -->
        <div class="bg-white/5 rounded-xl p-6 space-y-6">
          <div class="space-y-1">
            <h1 class="text-3xl font-bold">{{ veicolo.titolo }}</h1>
            <p class="text-sm text-[#A30000]">Codice: {{ veicolo.codice }}</p>
          </div>

          <ul class="space-y-2 text-sm divide-y divide-white/10">
            <li class="flex justify-between pt-2">
              <span class="text-white/60">Marca:</span>
              <span class="font-medium text-white">{{ veicolo.marca || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span class="text-white/60">Modello:</span>
              <span class="font-medium text-white">{{ veicolo.modello || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span class="text-white/60">Carrozzeria:</span>
              <span class="font-medium text-white">{{ veicolo.carrozzeria || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span class="text-white/60">Carburante:</span>
              <span class="font-medium text-white">{{ veicolo.carburante || 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span class="text-white/60">Prezzo:</span>
              <span class="font-medium text-white">{{ veicolo.prezzo ? veicolo.prezzo + ' €' : 'n.d.' }}</span>
            </li>
            <li class="flex justify-between pt-2">
              <span class="text-white/60">Dealer:</span>
              <span class="font-medium text-white">{{ veicolo.dealer || 'n.d.' }}</span>
            </li>
          </ul>
<!-- Azioni -->
<div class="flex flex-wrap gap-4 pt-6">
  <NuxtLink
    to="/usato"
    class="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded text-sm shadow"
  >
    Torna indietro
  </NuxtLink>
  <a
    href="mailto:info@mycarsbergamo.com?subject=Richiesta%20informazioni%20su%20{{ veicolo.titolo }}"
    class="bg-[#A30000] hover:bg-red-800 text-white px-5 py-2 rounded text-sm shadow"
  >
    Contattaci
  </a>
</div>
        </div>
      </div>

      <!-- Tab info aggiuntive -->
      <div v-if="veicolo" class="bg-white/5 rounded-xl p-6 mt-10">
        <h2 class="text-xl font-bold mb-4 text-white/90">Scheda tecnica</h2>
        <div class="overflow-auto">
          <table class="w-full text-sm text-left text-white/70 border-separate border-spacing-y-2">
            <tbody>
              <tr>
                <td class="w-1/4 font-medium text-white/50">Codice</td>
                <td>{{ veicolo.codice }}</td>
              </tr>
              <tr>
                <td class="font-medium text-white/50">Marca</td>
                <td>{{ veicolo.marca || 'n.d.' }}</td>
              </tr>
              <tr>
                <td class="font-medium text-white/50">Modello</td>
                <td>{{ veicolo.modello || 'n.d.' }}</td>
              </tr>
              <tr>
                <td class="font-medium text-white/50">Anno</td>
                <td>{{ veicolo.anno || 'n.d.' }}</td>
              </tr>
              <tr>
                <td class="font-medium text-white/50">Carrozzeria</td>
                <td>{{ veicolo.carrozzeria || 'n.d.' }}</td>
              </tr>
              <tr>
                <td class="font-medium text-white/50">Carburante</td>
                <td>{{ veicolo.carburante || 'n.d.' }}</td>
              </tr>
              <tr>
                <td class="font-medium text-white/50">Prezzo</td>
                <td>{{ veicolo.prezzo ? veicolo.prezzo + ' €' : 'n.d.' }}</td>
              </tr>
              <tr>
                <td class="font-medium text-white/50">Dealer</td>
                <td>{{ veicolo.dealer || 'n.d.' }}</td>
              </tr>
              <!-- Puoi aggiungere altri campi -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
