<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  messaggio: '',
  privacy: false,
})

const errors = ref<string[]>([])
const success = ref(false)

const submitForm = () => {
  errors.value = []
  success.value = false

  if (
    !form.value.nome ||
    !form.value.cognome ||
    !form.value.email ||
    !form.value.telefono ||
    !form.value.messaggio ||
    !form.value.privacy
  ) {
    errors.value.push('Per favore compila tutti i campi obbligatori e accetta la privacy.')
    return
  }

  console.log('Inviato:', form.value)
  success.value = true

  form.value = {
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    messaggio: '',
    privacy: false
  }
}
</script>

<template>
  <section class="w-full bg-black text-white py-16 px-4 md:px-10 pb-40 ">
    <div class="max-w-screen-xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold text-[#A30000] mb-8">
        Contattaci per ulteriori informazioni
      </h1>

      <!-- Recapiti con icone -->
      <div class="mb-10 space-y-3 text-sm md:text-base">
        <p><strong>Indirizzo:</strong> Via dei Livelli di Sopra, 24060 Costa di Mezzate (BG)</p>

        <p class="flex items-center gap-2">
          <img src="/public/static/images/telefono.png" alt="Telefono" class="w-4 h-4" />
          <strong>Telefono:</strong>
          <a href="tel:+393803850700" class="underline">+39 380 385 0700</a>
        </p>

        <p class="flex items-center gap-2">
          <img src="/public/static/images/mailblack.png" alt="Email" class="w-4 h-3" />
          <strong>Email:</strong>
          <a href="mailto:info@maycars.it" class="underline">info@maycars.it</a>
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Nome e Cognome -->
        <div class="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            v-model="form.nome"
            placeholder="Nome *"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#A30000]"
          />
          <input
            type="text"
            v-model="form.cognome"
            placeholder="Cognome *"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#A30000]"
          />
        </div>

        <!-- Telefono e Email -->
        <div class="grid md:grid-cols-2 gap-6">
          <input
            type="tel"
            v-model="form.telefono"
            placeholder="Telefono *"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#A30000]"
          />
          <input
            type="email"
            v-model="form.email"
            placeholder="Email *"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#A30000]"
          />
        </div>

        <!-- Messaggio -->
        <textarea
          v-model="form.messaggio"
          rows="5"
          placeholder="Messaggio *"
          class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-[#A30000]"
        ></textarea>

        <!-- Privacy -->
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="form.privacy" class="accent-[#A30000]" />
          Acconsento al trattamento dei miei dati personali *
        </label>

        <!-- Errori -->
        <div v-if="errors.length" class="text-red-500 text-sm">
          <ul>
            <li v-for="(e, i) in errors" :key="i">• {{ e }}</li>
          </ul>
        </div>

        <!-- Success -->
        <div v-if="success" class="text-green-400 text-sm">Messaggio inviato con successo!</div>

        <!-- Submit -->
        <button
          type="submit"
          class="bg-[#A30000] hover:bg-red-800 text-white px-6 py-3 rounded font-semibold transition"
        >
          Invia messaggio
        </button>
      </form>
    </div>
  </section>
</template>
