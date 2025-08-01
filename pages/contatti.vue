<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '#imports'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

useHead({
  title: t('contatti.meta.title'),
  meta: [
    {
      name: 'description',
      content: t('contatti.meta.description')
    },
    {
      name: 'keywords',
      content: t('contatti.meta.keywords')
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: t('contatti.meta.ogTitle') },
    { property: 'og:description', content: t('contatti.meta.ogDescription') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.mycarsbergamo.it/contatti' },
    { property: 'og:locale', content: 'it_IT' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.mycarsbergamo.it/contatti' }
  ]
})

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
    errors.value.push(t('contatti.form.error'))
    return
  }

  const subject = encodeURIComponent(t('contatti.form.emailSubject'))
  const body = encodeURIComponent(
    `Nome: ${form.value.nome}\n` +
    `Cognome: ${form.value.cognome}\n` +
    `Telefono: ${form.value.telefono}\n` +
    `Email: ${form.value.email}\n\n` +
    `Messaggio:\n${form.value.messaggio}`
  )

  const mailtoLink = `mailto:info@maycars.it?subject=${subject}&body=${body}`
  window.location.href = mailtoLink

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
  <main>
    <section class="w-full bg-black text-white py-16 px-4 md:px-10 pb-40" aria-labelledby="contatti-title">
      <div class="max-w-screen-xl mx-auto">
        <h1 id="contatti-title" class="text-3xl md:text-4xl font-bold text-white mb-8">
          {{ t('contatti.title') }}
        </h1>

        <!-- Recapiti -->
        <address class="mb-10 space-y-3 text-sm md:text-base not-italic">
          <p><strong>{{ t('contatti.recapiti.indirizzo') }}</strong> {{ t('contatti.recapiti.indirizzoValue') }}</p>
          <p class="flex items-center gap-2">
            <img src="/static/images/telefono.png" alt="Icona telefono" class="w-4 h-4" loading="lazy" />
            <strong>{{ t('contatti.recapiti.telefono') }}</strong>
            <a href="tel:+393803850700" class="underline">+39 380 385 0700</a>
          </p>
          <p class="flex items-center gap-2">
            <img src="/static/images/mailblack.png" alt="Icona email" class="w-4 h-3" loading="lazy" />
            <strong>{{ t('contatti.recapiti.email') }}</strong>
            <a href="mailto:info@maycars.it" class="underline">info@maycars.it</a>
          </p>
        </address>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-6" aria-label="Modulo contatto">
          <!-- Nome e Cognome -->
          <div class="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              v-model="form.nome"
              :placeholder="t('contatti.form.nome')"
              aria-label="Nome"
              class="input"
              required
            />
            <input
              type="text"
              v-model="form.cognome"
              :placeholder="t('contatti.form.cognome')"
              aria-label="Cognome"
              class="input"
              required
            />
          </div>

          <!-- Telefono e Email -->
          <div class="grid md:grid-cols-2 gap-6">
            <input
              type="tel"
              v-model="form.telefono"
              :placeholder="t('contatti.form.telefono')"
              aria-label="Telefono"
              class="input"
              required
            />
            <input
              type="email"
              v-model="form.email"
              :placeholder="t('contatti.form.email')"
              aria-label="Email"
              class="input"
              required
            />
          </div>

          <!-- Messaggio -->
          <textarea
            v-model="form.messaggio"
            rows="5"
            :placeholder="t('contatti.form.messaggio')"
            aria-label="Messaggio"
            class="input resize-none h-32"
            required
          ></textarea>

          <!-- Privacy -->
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="form.privacy" class="accent-[#A30000]" required />
            {{ t('contatti.form.privacy') }}
          </label>

          <!-- Errori -->
          <div v-if="errors.length" class="text-red-500 text-sm">
            <ul>
              <li v-for="(e, i) in errors" :key="i">• {{ e }}</li>
            </ul>
          </div>

          <!-- Success (opzionale) -->
          <div v-if="success" class="text-green-500 text-sm">{{ t('contatti.form.success') }}</div>

          <!-- Submit -->
          <button
            type="submit"
            class="bg-[#A30000] hover:bg-red-800 text-white px-6 py-3 rounded font-semibold transition"
          >
            {{ t('contatti.form.submit') }}
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease-in-out;
}
.input:focus {
  outline: none;
  border-color: #A30000;
}
</style>
