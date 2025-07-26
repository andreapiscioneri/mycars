<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db, auth } from '@/lib/firebase'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'

const router = useRouter()
const veicoli = ref([])
const editingId = ref(null)
const errorMsg = ref('')

const newVeicolo = ref({
  titolo: '',
  descrizione: '',
  marca: '',
  modello: '',
  carrozzeria: '',
  carburante: '',
  anno: '',
  prezzo: '',
  chilometri: '',
  venditore: '',
  immagine: '',
  galleria: [],
  tipo: 'usato'
})

const loadData = async () => {
  const snapshot = await getDocs(collection(db, 'annunci'))
  veicoli.value = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      anno: data.anno?.toDate?.() || null
    }
  })
}

const addVeicolo = async () => {
  errorMsg.value = ''

  try {
    console.log('👤 Utente corrente:', auth.currentUser)

    if (!newVeicolo.value.titolo || !newVeicolo.value.marca) {
      errorMsg.value = 'Compila almeno titolo e marca.'
      return
    }

    const codice = Date.now()

    const veicoloDaSalvare = {
      ...newVeicolo.value,
      codice,
      prezzo: parseFloat(newVeicolo.value.prezzo) || 0,
      chilometri: parseInt(newVeicolo.value.chilometri) || 0,
      anno: newVeicolo.value.anno ? new Date(newVeicolo.value.anno) : null,
      createdAt: serverTimestamp()
    }

    console.log('📦 Dati che sto per salvare:', veicoloDaSalvare)

    const docRef = await addDoc(collection(db, 'annunci'), veicoloDaSalvare)

    console.log('✅ Veicolo salvato con ID:', docRef.id)

    resetForm()
    await loadData()
  } catch (err) {
    console.error('❌ Errore durante il salvataggio:', err)
    errorMsg.value = 'Errore durante il salvataggio: ' + err.message
  }
}

const saveEdit = async (v) => {
  try {
    await updateDoc(doc(db, 'annunci', v.id), {
      ...v,
      prezzo: parseFloat(v.prezzo) || 0,
      chilometri: parseInt(v.chilometri) || 0,
      anno: v.anno ? new Date(v.anno) : null
    })
    editingId.value = null
    await loadData()
  } catch (err) {
    console.error('Errore modifica:', err)
  }
}

const deleteVeicolo = async (id) => {
  if (confirm('Confermi eliminazione?')) {
    try {
      await deleteDoc(doc(db, 'annunci', id))
      await loadData()
    } catch (err) {
      console.error('Errore eliminazione:', err)
    }
  }
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
    chilometri: '',
    venditore: '',
    immagine: '',
    galleria: [],
    tipo: 'usato'
  }
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
    reader.onload = () => newVeicolo.value.galleria.push(reader.result)
    reader.readAsDataURL(file)
  })
}

const logout = () => {
  auth.signOut()
  localStorage.removeItem('auth')
  router.push('/login')
}

onMounted(() => {
  auth.onAuthStateChanged(async (user) => {
    console.log('🔐 Stato utente:', user)
    if (user) {
      await loadData()
    } else {
      router.push('/login')
    }
  })
})
</script>

<template>
  <div class="p-6 text-white bg-black min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Area Riservata</h1>
      <button @click="logout" class="text-red-400 hover:underline text-sm">Logout</button>
    </div>

    <div v-if="errorMsg" class="text-red-500 mb-4">{{ errorMsg }}</div>

    <!-- FORM -->
    <div class="space-y-3 mb-10">
      <input v-model="newVeicolo.titolo" placeholder="Titolo" class="input" />
      <input v-model="newVeicolo.marca" placeholder="Marca" class="input" />
      <input v-model="newVeicolo.modello" placeholder="Modello" class="input" />
      <input v-model="newVeicolo.carrozzeria" placeholder="Carrozzeria" class="input" />
      <input v-model="newVeicolo.carburante" placeholder="Carburante" class="input" />
      <input v-model="newVeicolo.anno" type="date" class="input" />
      <input v-model="newVeicolo.prezzo" type="number" placeholder="Prezzo (€)" class="input" />
      <input v-model="newVeicolo.chilometri" type="number" placeholder="Chilometri" class="input" />
      <input v-model="newVeicolo.venditore" placeholder="Venditore" class="input" />
      <select v-model="newVeicolo.tipo" class="input">
        <option value="usato">Usato</option>
        <option value="noleggio">Noleggio</option>
      </select>
      <textarea v-model="newVeicolo.descrizione" placeholder="Descrizione" class="input" />
      <label class="block text-sm">Immagine principale</label>
      <input type="file" @change="handleNewFile" class="input" />
      <label class="block text-sm">Galleria immagini</label>
      <input type="file" multiple @change="handleNewGallery" class="input" />
      <button @click="addVeicolo" class="bg-red-600 px-4 py-2 rounded text-white">Salva Veicolo</button>
    </div>

    <!-- VEICOLI -->
    <div class="space-y-8">
      <div v-for="tipo in ['usato', 'noleggio']" :key="tipo">
        <h2 class="text-xl font-bold mb-2">
          Veicoli {{ tipo === 'usato' ? 'Usati' : 'a Noleggio' }}
        </h2>
        <div
          v-for="v in veicoli.filter(ve => ve.tipo === tipo)"
          :key="v.id"
          class="border-t border-white/10 pt-4 mt-4"
        >
          <div v-if="editingId !== v.id">
            <h3 class="text-xl font-semibold">{{ v.titolo }} - {{ v.prezzo }} €</h3>
            <p class="text-sm text-white/60">
              {{ v.marca }} {{ v.modello }} | {{ v.anno instanceof Date ? v.anno.getFullYear() : '' }}
            </p>
            <img v-if="v.immagine" :src="v.immagine" class="w-32 my-2 rounded" />
            <button @click="editingId = v.id" class="text-blue-400 mr-4">Modifica</button>
            <button @click="deleteVeicolo(v.id)" class="text-red-400">Elimina</button>
          </div>
          <div v-else class="space-y-2">
            <input v-model="v.titolo" class="input" />
            <input v-model="v.marca" class="input" />
            <input v-model="v.modello" class="input" />
            <input v-model="v.anno" type="date" class="input" />
            <input v-model="v.prezzo" type="number" class="input" />
            <textarea v-model="v.descrizione" class="input" />
            <button @click="saveEdit(v)" class="text-green-500 mr-4">Salva</button>
            <button @click="editingId = null" class="text-white/70">Annulla</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  display: block;
  width: 100%;
  background: #111;
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #333;
  margin-bottom: 0.5rem;
}
</style>
