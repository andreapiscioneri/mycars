<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const addGalleryImages = (e, v) => {
  const files = Array.from(e.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      v.galleria.push(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

const router = useRouter()
const veicoli = ref([])
const venditoriDisponibili = ref(['Mario Rossi', 'Auto Srl', 'Venditore Demo'])
const setAsMainImage = (v, img) => {
  v.immagine = img
}
const labels = {
  titolo: 'Titolo',
  descrizione: 'Descrizione',
  marca: 'Marca',
  modello: 'Modello',
  carrozzeria: 'Carrozzeria',
  carburante: 'Carburante',
  anno: 'Anno di Immatricolazione',
  prezzo: 'Prezzo (€)',
  chilometri: 'Chilometri',
  venditore: 'Venditore',
  tipo: 'Tipo',
  immagine: 'Immagine Principale',
  galleria: 'Galleria Immagini',
  cerca: 'Cerca'
}

const newVeicolo = ref({
  titolo: '', descrizione: '', marca: '', modello: '', carrozzeria: '', carburante: '', anno: '', prezzo: '', chilometri: '', venditore: '', immagine: '', galleria: [], tipo: 'usato'
})


const ricerca = {
  usato: ref(''),
  noleggio: ref('')
}

const editingCodice = ref(null)
const openSections = ref({ usato: false, noleggio: false })

onMounted(async () => {
  if (localStorage.getItem('auth') !== 'true') router.push('/login')
  await loadData()
})

const loadData = async () => {
  try {
    const res = await fetch('/api/veicoli')
    veicoli.value = await res.json()
  } catch (e) {
    console.error('Errore caricamento dati:', e)
  }
}

const saveVeicoloToServer = async (data) => {
  await fetch('/api/veicoli', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

const updateVeicoloOnServer = async (index, data) => {
  await fetch('/api/veicoli', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, data })
  })
}

const deleteVeicoloFromServer = async (index) => {
  await fetch('/api/veicoli', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  })
}

const logout = () => {
  localStorage.removeItem('auth')
  router.push('/login')
}

const handleNewFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { newVeicolo.value.immagine = reader.result }
  reader.readAsDataURL(file)
}

const handleNewGallery = (e) => {
  const files = Array.from(e.target.files)
  newVeicolo.value.galleria = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = () => newVeicolo.value.galleria.push(reader.result)
    reader.readAsDataURL(file)
  })
}

const addVeicolo = async () => {
  const codice = Date.now()
  const nuovo = {
    ...newVeicolo.value,
    codice,
    prezzo: parseFloat(newVeicolo.value.prezzo) || null
    // NON convertiamo anno in numero, lasciamo stringa
  }

  await saveVeicoloToServer(nuovo)
  await loadData()
  resetForm()
}

const resetForm = () => {
  newVeicolo.value = { titolo: '', descrizione: '', marca: '', modello: '', carrozzeria: '', carburante: '', anno: '', prezzo: '', venditore: '', immagine: '', galleria: [], tipo: 'usato' }
}

const deleteVeicolo = async (codice) => {
  if (!confirm('Confermi eliminazione?')) return
  const index = veicoli.value.findIndex(v => v.codice === codice)
  if (index !== -1) {
    await deleteVeicoloFromServer(index)
    await loadData()
  }
}

const saveEditInline = async (v) => {
  const index = veicoli.value.findIndex(item => item.codice === v.codice)
  v.prezzo = parseFloat(v.prezzo) || null
  editingCodice.value = null

  if (index !== -1) {
    await updateVeicoloOnServer(index, v)
    await loadData()
  }
}

const handleEditImageInline = (e, v) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { v.immagine = reader.result }
  reader.readAsDataURL(file)
}

const handleEditGalleryImage = (e, v, index) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    v.galleria.splice(index, 1, reader.result)
  }
  reader.readAsDataURL(file)
}

const removeGalleryImage = (v, index) => {
  v.galleria.splice(index, 1)
}

const addGalleryImage = (e, v) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    v.galleria.push(reader.result)
  }
  reader.readAsDataURL(file)
}

const filteredVeicoli = (tipo) => {
  const q = ricerca[tipo].value.toLowerCase()
  return veicoli.value.filter(v =>
    v.tipo === tipo && (
      v.titolo.toLowerCase().includes(q) ||
      v.marca.toLowerCase().includes(q) ||
      v.modello.toLowerCase().includes(q) ||
      String(v.anno).includes(q) ||
      String(v.prezzo).includes(q)
    )
  )
}

</script>

<template>
  <section class="bg-black text-white min-h-screen py-16 px-4 md:px-10">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-2xl font-bold">Gestione Veicoli</h1>
        <button @click="logout" class="text-red-500 hover:underline text-sm">Logout</button>
      </div>

      <!-- Form nuovo veicolo -->
      <div class="mb-12 bg-white/5 p-6 rounded-xl space-y-4">
        <h2 class="text-lg font-semibold">Aggiungi Veicolo</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label> {{ labels.titolo }} <input v-model="newVeicolo.titolo" class="input" /> </label>
          <label> {{ labels.marca }} <input v-model="newVeicolo.marca" class="input" /> </label>
          <label> {{ labels.modello }} <input v-model="newVeicolo.modello" class="input" /> </label>
          <label> {{ labels.carrozzeria }} <input v-model="newVeicolo.carrozzeria" class="input" /> </label>
          <label> {{ labels.carburante }} <input v-model="newVeicolo.carburante" class="input" /> </label>
          <label> {{ labels.anno }} <input v-model="newVeicolo.anno" type="date" class="input" /> </label>
          <label> {{ labels.prezzo }} <input v-model="newVeicolo.prezzo" type="number" step="0.01" class="input" /> </label>
          <label> {{ labels.chilometri }}
  <input v-model="newVeicolo.chilometri" type="number" class="input" />
</label>

      <label>
        {{ labels.venditore }}
        <input v-model="newVeicolo.venditore" class="input" placeholder="Inserisci venditore" />
      </label>
          <label>
            {{ labels.tipo }}
            <select v-model="newVeicolo.tipo" class="input">
              <option value="usato">Usato</option>
              <option value="noleggio">Noleggio</option>
            </select>
          </label>
        </div>

        <div>
          <label for="file-immagine" class="upload-btn">📎 {{ labels.immagine }}</label>
          <input id="file-immagine" type="file" @change="handleNewFile" class="hidden" />
          <img v-if="newVeicolo.immagine" :src="newVeicolo.immagine" class="mt-2 w-full max-w-xs rounded shadow" />
        </div>

        <div class="mt-4">
          <label for="file-gallery" class="upload-btn">📎 {{ labels.galleria }}</label>
          <input id="file-gallery" type="file" multiple @change="handleNewGallery" class="hidden" />
          <div class="flex flex-wrap gap-3 mt-3">
            <div v-for="(img, i) in newVeicolo.galleria" :key="i" class="w-24 h-24 rounded overflow-hidden">
              <img :src="img" class="w-full h-full object-cover border border-white/20" />
            </div>
          </div>
        </div>

        <label>{{ labels.descrizione }} <textarea v-model="newVeicolo.descrizione" class="input w-full" /></label>
        <button @click="addVeicolo" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">Salva Veicolo</button>
      </div>

      <!-- Lista veicoli -->
      <div v-for="tipo in ['usato', 'noleggio']" :key="tipo" class="mb-10">
        <div class="flex justify-between items-center mb-2 cursor-pointer" @click="openSections[tipo] = !openSections[tipo]">
          <h2 class="text-xl font-bold">Veicoli {{ tipo === 'usato' ? 'usati' : 'a noleggio' }}</h2>
          <span class="text-white text-2xl font-bold">{{ openSections[tipo] ? '−' : '+' }}</span>
        </div>

        <div v-if="openSections[tipo]" class="mb-6">
          <label class="block text-sm font-medium text-white mb-2">{{ labels.cerca }}</label>
          <input v-model="ricerca[tipo].value" type="text" class="input w-full" placeholder="Es. Panda, Mercedes..." />
        </div>

        <div v-if="openSections[tipo]" v-for="v in filteredVeicoli(tipo)" :key="v.codice" class="bg-white/5 p-5 rounded-xl mb-4 space-y-4">
          <div v-if="editingCodice !== v.codice" class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-4">
              <img :src="v.immagine" class="w-24 h-24 object-cover rounded" />
              <div>
                <h3 class="text-lg font-semibold">{{ v.titolo }}</h3>
                <p class="text-sm text-white/70">{{ v.marca }} {{ v.modello }}</p>
                <p class="text-xs text-white/50">{{ labels.prezzo }}: {{ v.prezzo ? v.prezzo + ' €' : 'n.d.' }}</p>
                <p class="text-xs text-white/50">{{ labels.anno }}: {{ v.anno || 'n.d.' }}</p>
              </div>
            </div>
            <div class="mt-4 md:mt-0 flex gap-4">
              <button @click="editingCodice = v.codice" class="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded text-sm">Modifica</button>
              <button @click="deleteVeicolo(v.codice)" class="text-sm text-red-400 hover:text-red-600">Elimina</button>
            </div>
          </div>

          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label> {{ labels.titolo }} <input v-model="v.titolo" class="input" /> </label>
              <label> {{ labels.marca }} <input v-model="v.marca" class="input" /> </label>
              <label> {{ labels.modello }} <input v-model="v.modello" class="input" /> </label>
              <label> {{ labels.carrozzeria }} <input v-model="v.carrozzeria" class="input" /> </label>
              <label> {{ labels.carburante }} <input v-model="v.carburante" class="input" /> </label>
              <label> {{ labels.anno }} <input v-model="v.anno" type="date" class="input" /> </label>
              <label> {{ labels.prezzo }} <input v-model="v.prezzo" type="number" step="0.01" class="input" /> </label>
              <label> {{ labels.chilometri }}
  <input v-model="v.chilometri" type="number" class="input" />
</label>

              <label>
                {{ labels.venditore }}
                <input v-model="v.venditore" class="input" placeholder="Modifica venditore" />
              </label>
              <label class="md:col-span-2">{{ labels.descrizione }} <textarea v-model="v.descrizione" class="input" /></label>
            </div>

            <label class="block text-sm mt-2">{{ labels.immagine }}</label>
            <input type="file" @change="e => handleEditImageInline(e, v)" class="text-sm text-white" />
            <img v-if="v.immagine" :src="v.immagine" class="w-full max-w-xs mt-2 rounded" />

<!-- GALLERIA -->
<div class="mt-4">
  <label class="block text-sm font-semibold">{{ labels.galleria }}</label>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
    <!-- Immagini esistenti -->
    <div
      v-for="(img, i) in v.galleria"
      :key="i"
      class="relative p-2 bg-white/10 rounded"
    >
      <img :src="img" class="w-full h-24 object-cover rounded" />

      <!-- Imposta come principale -->
      <button
        @click="setAsMainImage(v, img)"
        class="text-xs mt-2 text-blue-400 hover:underline block text-center"
      >
        {{ v.immagine === img ? 'Immagine Principale ✅' : 'Imposta Principale' }}
      </button>

      <!-- Rimuovi immagine -->
      <button
        @click="removeGalleryImage(v, i)"
        class="absolute top-1 right-1 text-white bg-black/70 rounded px-1 text-xs hover:bg-red-600"
      >
        ✕
      </button>
    </div>

    <!-- Upload multiplo -->
    <div class="flex items-center justify-center p-2 border-2 border-dashed border-white/30 rounded">
      <input
        type="file"
        multiple
        @change="e => addGalleryImages(e, v)"
        class="block w-full text-xs text-white"
      />
    </div>
  </div>
</div>



            <div class="flex gap-4 pt-3">
              <button @click="saveEditInline(v)" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">Salva</button>
              <button @click="editingCodice = null" class="text-sm text-gray-300 hover:underline">Annulla</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.input {
  background-color: #1a1a1a;
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 0.875rem;
  transition: border-color 0.2s;
  appearance: none;
  padding-right: 1rem;
}
.input:focus {
  outline: none;
  border-color: #888;
}
.upload-btn {
  display: inline-block;
  background: #f1f1f1;
  color: #111;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.upload-btn:hover {
  background: #e2e2e2;
  transform: scale(1.02);
}
label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e2e2;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
