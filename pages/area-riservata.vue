<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const veicoli = ref([])
const titolo = ref('')
const descrizione = ref('')
const immagine = ref('')
const editingIndex = ref(-1)

onMounted(async () => {
  if (localStorage.getItem('auth') !== 'true') router.push('/login')
  const res = await fetch('/api/veicoli')
  veicoli.value = await res.json()
})

const logout = () => {
  localStorage.removeItem('auth')
  router.push('/login')
}

const handleFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    immagine.value = reader.result
  }
  reader.readAsDataURL(file)
}

const resetForm = () => {
  titolo.value = ''
  descrizione.value = ''
  immagine.value = ''
  editingIndex.value = -1
}

const saveVeicolo = async () => {
  const data = {
    titolo: titolo.value,
    descrizione: descrizione.value,
    immagine: immagine.value
  }

  if (editingIndex.value === -1) {
    await fetch('/api/veicoli', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } else {
    await fetch('/api/veicoli', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: editingIndex.value, data })
    })
  }

  const res = await fetch('/api/veicoli')
  veicoli.value = await res.json()
  resetForm()
}

const editVeicolo = (index) => {
  const v = veicoli.value[index]
  titolo.value = v.titolo
  descrizione.value = v.descrizione
  immagine.value = v.immagine
  editingIndex.value = index
}

const deleteVeicolo = async (index) => {
  if (!confirm('Sei sicuro di voler eliminare questo veicolo?')) return
  await fetch('/api/veicoli', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  })
  const res = await fetch('/api/veicoli')
  veicoli.value = await res.json()
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Area Riservata</h2>
      <button @click="logout" class="text-sm text-red-600 hover:underline">Logout</button>
    </div>

    <form @submit.prevent="saveVeicolo" class="space-y-4 mb-10">
      <input v-model="titolo" placeholder="Titolo" class="border px-4 py-2 w-full" />
      <textarea v-model="descrizione" placeholder="Descrizione" class="border px-4 py-2 w-full" />
      <input type="file" @change="handleFile" class="border px-2 py-1 w-full" />
      <button type="submit" class="bg-blue-700 text-white px-4 py-2">
        {{ editingIndex === -1 ? 'Aggiungi' : 'Salva modifiche' }}
      </button>
      <button v-if="editingIndex !== -1" type="button" @click="resetForm" class="ml-2 text-gray-500 text-sm">Annulla</button>
    </form>

    <div v-for="(v, i) in veicoli" :key="i" class="border p-4 mb-4 rounded bg-white text-black">
      <h3 class="text-lg font-semibold">{{ v.titolo }}</h3>
      <p>{{ v.descrizione }}</p>
      <img v-if="v.immagine" :src="v.immagine" alt="img" class="w-full max-w-xs mt-2 rounded" />
      <div class="mt-3 flex gap-2">
        <button @click="editVeicolo(i)" class="text-blue-600 text-sm hover:underline">Modifica</button>
        <button @click="deleteVeicolo(i)" class="text-red-600 text-sm hover:underline">Elimina</button>
      </div>
    </div>
  </div>
</template>
