<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const veicoli = ref([])
const newVeicolo = ref({
  titolo: '',
  descrizione: '',
  marca: '',
  modello: '',
  carrozzeria: '',
  carburante: '',
  anno: '',
  prezzo: '',
  dealer: '',
  codice: '',
  immagine: '',
  galleria: [],
  tipo: 'usato'
})
const editingCodice = ref(null)
const ricerca = {
  usato: ref(''),
  noleggio: ref('')
}
const openSections = ref({ usato: false, noleggio: false })

onMounted(async () => {
  if (localStorage.getItem('auth') !== 'true') router.push('/login')
  await loadData()
})

const logout = () => {
  localStorage.removeItem('auth')
  router.push('/login')
}

const loadData = async () => {
  const res = await fetch('/api/veicoli')
  veicoli.value = await res.json()
}

const handleNewFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    newVeicolo.value.immagine = reader.result
  }
  reader.readAsDataURL(file)
}

const handleNewGallery = (e) => {
  const files = Array.from(e.target.files)
  newVeicolo.value.galleria = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      newVeicolo.value.galleria.push(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

const addVeicolo = async () => {
  await fetch('/api/veicoli', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newVeicolo.value)
  })
  resetForm()
  await loadData()
}

const resetForm = () => {
  newVeicolo.value = {
    titolo: '',
    descrizione: '',
    marca: '',
    modello: '',
    carrozzeria: '',
    carburante: '',
    anno: '',
    prezzo: '',
    dealer: '',
    codice: '',
    immagine: '',
    galleria: [],
    tipo: 'usato'
  }
}

const deleteVeicolo = async (codice) => {
  if (!confirm('Confermi eliminazione?')) return
  await fetch('/api/veicoli', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codice })
  })
  await loadData()
}

const saveEditInline = async (v) => {
  await fetch('/api/veicoli', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codice: v.codice, data: v })
  })
  editingCodice.value = null
  await loadData()
}

const handleEditImageInline = (e, v) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    v.immagine = reader.result
  }
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
  return veicoli.value
    .filter(v => v.tipo === tipo)
    .filter(v =>
      v.titolo.toLowerCase().includes(q) ||
      v.marca.toLowerCase().includes(q) ||
      v.modello.toLowerCase().includes(q)
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

      <!-- FORM AGGIUNTA -->
      <div class="mb-12 bg-white/5 p-6 rounded-xl space-y-4">
        <h2 class="text-lg font-semibold">Aggiungi Veicolo</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input v-model="newVeicolo.titolo" placeholder="Titolo" class="input" />
          <input v-model="newVeicolo.marca" placeholder="Marca" class="input" />
          <input v-model="newVeicolo.modello" placeholder="Modello" class="input" />
          <input v-model="newVeicolo.carrozzeria" placeholder="Carrozzeria" class="input" />
          <input v-model="newVeicolo.carburante" placeholder="Carburante" class="input" />
          <input v-model="newVeicolo.anno" type="number" placeholder="Anno" class="input" />
          <input v-model="newVeicolo.prezzo" type="number" placeholder="Prezzo (€)" class="input" />
          <input v-model="newVeicolo.dealer" placeholder="Dealer" class="input" />
          <input v-model="newVeicolo.codice" placeholder="Codice" class="input" />
          <select v-model="newVeicolo.tipo" class="input">
            <option value="usato">Usato</option>
            <option value="noleggio">Noleggio</option>
          </select>
        </div>
<!-- Pulsante per immagine principale -->
<div>
  <label for="file-immagine" class="upload-btn">
    📎 Scegli immagine principale
  </label>
  <input id="file-immagine" type="file" @change="handleNewFile" class="hidden" />
  <img v-if="newVeicolo.immagine" :src="newVeicolo.immagine" alt="Anteprima" class="mt-2 w-full max-w-xs rounded shadow" />
</div>

<!-- Pulsante per galleria -->
<div class="mt-4">
  <label for="file-gallery" class="upload-btn">
    📎 Scegli immagini galleria
  </label>
  <input id="file-gallery" type="file" multiple @change="handleNewGallery" class="hidden" />
  <div class="flex flex-wrap gap-3 mt-3">
    <div v-for="(img, i) in newVeicolo.galleria" :key="i" class="w-24 h-24 rounded overflow-hidden">
      <img :src="img" alt="Gallery" class="w-full h-full object-cover border border-white/20" />
    </div>
  </div>
</div>


        <textarea v-model="newVeicolo.descrizione" placeholder="Descrizione" class="input w-full" />
        <button @click="addVeicolo" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">Salva Veicolo</button>
      </div>

      <!-- SEZIONI USATO / NOLEGGIO -->
      <div v-for="tipo in ['usato', 'noleggio']" :key="tipo" class="mb-10">
        <div class="flex justify-between items-center mb-2 cursor-pointer" @click="openSections[tipo] = !openSections[tipo]">
          <h2 class="text-xl font-bold">Veicoli {{ tipo === 'usato' ? 'Usati' : 'a Noleggio' }}</h2>
          <span class="text-white text-2xl font-bold">{{ openSections[tipo] ? '−' : '+' }}</span>
        </div>

        <div v-if="openSections[tipo]" class="mb-6">
          <label class="block text-sm font-medium text-white mb-2">
            Cerca nei veicoli {{ tipo === 'usato' ? 'Usati' : 'a Noleggio' }}
          </label>
          <input
            v-model="ricerca[tipo].value"
            type="text"
            placeholder="Es. Panda, Mercedes, SUV..."
            class="input w-full placeholder:text-gray-400"
          />
        </div>

        <div
          v-if="openSections[tipo]"
          v-for="v in filteredVeicoli(tipo)"
          :key="v.codice"
          class="bg-white/5 p-5 rounded-xl mb-4 space-y-4"
        >
          <!-- Compact view -->
          <div v-if="editingCodice !== v.codice" class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-4">
              <img :src="v.immagine" alt="img" class="w-24 h-24 object-cover rounded" />
              <div>
                <h3 class="text-lg font-semibold">{{ v.titolo }}</h3>
                <p class="text-sm text-white/70">{{ v.marca }} {{ v.modello }}</p>
              </div>
            </div>
            <div class="mt-4 md:mt-0 flex gap-4">
              <button @click="editingCodice = v.codice" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">Modifica</button>
              <button @click="deleteVeicolo(v.codice)" class="text-sm text-red-400 hover:text-red-600">Elimina</button>
            </div>
          </div>

          <!-- Edit view -->
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input v-model="v.titolo" class="input" />
              <input v-model="v.marca" class="input" />
              <input v-model="v.modello" class="input" />
              <input v-model="v.carrozzeria" class="input" />
              <input v-model="v.carburante" class="input" />
              <input v-model="v.anno" type="number" class="input" />
              <input v-model="v.prezzo" type="number" class="input" />
              <input v-model="v.dealer" class="input" />
              <input v-model="v.codice" class="input" disabled />
              <textarea v-model="v.descrizione" class="input md:col-span-2" />
            </div>

            <label class="block text-sm mt-2">Immagine principale</label>
            <input type="file" @change="e => handleEditImageInline(e, v)" class="text-sm text-white" />
            <img v-if="v.immagine" :src="v.immagine" alt="img" class="w-full max-w-xs mt-2 rounded" />

            <div class="mt-4">
              <label class="block text-sm mb-1">Galleria</label>
              <div class="flex flex-wrap gap-4">
                <div v-for="(img, i) in v.galleria" :key="i" class="relative w-32">
                  <img :src="img" alt="galleria" class="w-full h-24 object-cover rounded" />
                  <input type="file" @change="e => handleEditGalleryImage(e, v, i)" class="text-xs mt-1 text-white" />
                  <button @click="removeGalleryImage(v, i)" class="absolute top-0 right-0 bg-black/70 text-white text-xs px-1 rounded">✕</button>
                </div>
                <div>
                  <input type="file" @change="e => addGalleryImage(e, v)" class="text-xs text-white mt-1" />
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
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg fill='white' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  padding-right: 2rem;
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

</style>
