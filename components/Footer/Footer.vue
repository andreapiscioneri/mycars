<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showHours = ref(false)

const nome = ref('')
const cognome = ref('')
const telefono = ref('')
const email = ref('')
const oggetto = ref('')
const messaggio = ref('')
const privacy = ref(false)
const error = ref(false)

const sendMail = () => {
  error.value = false

  if (!privacy.value) {
    error.value = true
    return
  }

  const subject = encodeURIComponent(oggetto.value)
  const body = encodeURIComponent(
    `Nome: ${nome.value}\n` +
    `Cognome: ${cognome.value}\n` +
    `Telefono: ${telefono.value}\n` +
    `Email: ${email.value}\n\n` +
    `${messaggio.value}`
  )

  const mailtoLink = `mailto:info@mycarsbergamo.it?subject=${subject}&body=${body}`
  window.location.href = mailtoLink
}
</script>

<template>
  <footer class="bg-black text-white pt-12 sm:pt-16 px-4 sm:px-6">
    <!-- Contattaci + Form -->
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-start pb-12 sm:pb-16 border-b border-gray-800">
      <div class="space-y-4 lg:space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#A30000]">{{ t('footer.contatti.title') }}</h2>
        <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
          {{ t('footer.contatti.description') }}
        </p>
      </div>

      <div class="space-y-4 lg:space-y-6">
        <h3 class="text-lg sm:text-xl font-light text-gray-200">{{ t('footer.contatti.formTitle') }}</h3>
        <form class="space-y-4" @submit.prevent="sendMail">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input v-model="nome" type="text" :placeholder="t('footer.contatti.form.nome')" required class="input" />
            <input v-model="cognome" type="text" :placeholder="t('footer.contatti.form.cognome')" required class="input" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input v-model="telefono" type="text" :placeholder="t('footer.contatti.form.telefono')" required class="input" />
            <input v-model="email" type="email" :placeholder="t('footer.contatti.form.email')" required class="input" />
          </div>
          <input v-model="oggetto" type="text" :placeholder="t('footer.contatti.form.oggetto')" required class="input" />
          <textarea v-model="messaggio" :placeholder="t('footer.contatti.form.messaggio')" required class="input h-28 sm:h-32 resize-none" />

          <!-- Consenso privacy -->
          <label class="flex items-start gap-3 text-sm sm:text-base text-gray-300 cursor-pointer">
            <input type="checkbox" v-model="privacy" class="accent-[#A30000] mt-1 flex-shrink-0" />
            <span>{{ t('footer.contatti.form.privacy') }}</span>
          </label>

          <!-- Messaggio errore -->
          <p v-if="error" class="text-red-500 text-sm">
            {{ t('footer.contatti.form.error') }}
          </p>

          <button type="submit" class="bg-[#A30000] text-white w-full py-3 sm:py-4 rounded-lg hover:bg-red-800 transition-all duration-300 font-medium text-sm sm:text-base">
            {{ t('footer.contatti.form.submit') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Info & Links -->
    <div class="max-w-7xl mx-auto py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-sm sm:text-base text-gray-300">
      <!-- Logo -->
      <div class="sm:col-span-2 lg:col-span-1">
        <a href="/">
          <img src="/static/images/mycarslogo.png" alt="MyCars Logo" class="h-8 sm:h-10 mb-4" />
        </a>
        <p class="text-xs sm:text-sm text-gray-400 max-w-sm">
          {{ t('footer.company.description') }}
        </p>
      </div>
            
      <!-- Informazioni -->
      <div>
        <h4 class="font-bold text-white mb-3 sm:mb-4">{{ t('footer.informazioni.title') }}</h4>
        <div class="space-y-2 sm:space-y-3">
          <NuxtLink to="/servizi" class="block hover:text-[#A30000] transition-colors">{{ t('footer.informazioni.links.servizi') }}</NuxtLink>
          <NuxtLink to="/usato" class="block hover:text-[#A30000] transition-colors">{{ t('footer.informazioni.links.usate') }}</NuxtLink>
          <NuxtLink to="/noleggio" class="block hover:text-[#A30000] transition-colors">{{ t('footer.informazioni.links.noleggio') }}</NuxtLink>
          <NuxtLink to="/chisiamo" class="block hover:text-[#A30000] transition-colors">{{ t('footer.informazioni.links.chisiamo') }}</NuxtLink>
          <NuxtLink to="/dovesiamo" class="block hover:text-[#A30000] transition-colors">{{ t('footer.informazioni.links.dovesiamo') }}</NuxtLink>
          <NuxtLink to="/contatti" class="block hover:text-[#A30000] transition-colors">{{ t('footer.informazioni.links.contatti') }}</NuxtLink>
        </div>
      </div>
      
      <!-- Contatti -->
      <div>
        <h4 class="font-bold text-white mb-3 sm:mb-4">{{ t('footer.dovesiamo.title') }}</h4>
        <div class="space-y-2 sm:space-y-3 text-sm">
          <div>
            <p class="font-medium text-white mb-1">{{ t('footer.dovesiamo.indirizzo') }}</p>
            <p class="text-gray-400 leading-relaxed">{{ t('footer.dovesiamo.indirizzoValue') }}</p>
          </div>
          <div>
            <p class="font-medium text-white mb-1">{{ t('footer.dovesiamo.telefono') }}</p>
            <a href="tel:3803850700" class="text-[#609BE1] hover:text-[#A30000] transition-colors">
              380 385 0700
            </a>
          </div>

          <!-- Accordion orari -->
          <div>
            <button 
              @click="showHours = !showHours" 
              class="w-full text-left font-bold text-white flex justify-between items-center mt-4 hover:text-[#A30000] transition-colors"
            >
              <span>{{ t('footer.dovesiamo.orari') }}</span>
              <span class="text-lg transition-transform" :class="{ 'rotate-180': showHours }">
                {{ showHours ? '−' : '+' }}
              </span>
            </button>
            <transition name="fade" mode="out-in">
              <div v-if="showHours" class="mt-3 text-xs sm:text-sm text-gray-400 space-y-1" key="open">
                <div class="grid grid-cols-2 gap-2">
                  <p>{{ t('footer.dovesiamo.giorni.domenica') }}</p><span class="text-white text-right">{{ t('footer.dovesiamo.orariValue.domenica') }}</span>
                  <p>{{ t('footer.dovesiamo.giorni.lunedi') }}</p><span class="text-white text-right">{{ t('footer.dovesiamo.orariValue.lunedi') }}</span>
                  <p>{{ t('footer.dovesiamo.giorni.martedi') }}</p><span class="text-white text-right">{{ t('footer.dovesiamo.orariValue.martedi') }}</span>
                  <p>{{ t('footer.dovesiamo.giorni.mercoledi') }}</p><span class="text-white text-right">{{ t('footer.dovesiamo.orariValue.mercoledi') }}</span>
                  <p>{{ t('footer.dovesiamo.giorni.giovedi') }}</p><span class="text-white text-right">{{ t('footer.dovesiamo.orariValue.giovedi') }}</span>
                  <p>{{ t('footer.dovesiamo.giorni.venerdi') }}</p><span class="text-white text-right">{{ t('footer.dovesiamo.orariValue.venerdi') }}</span>
                  <p>{{ t('footer.dovesiamo.giorni.sabato') }}</p><span class="text-white text-right">{{ t('footer.dovesiamo.orariValue.sabato') }}</span>
                </div>
              </div>
            </transition>
          </div>

          <div class="mt-4">
            <p class="text-xs sm:text-sm"><span class="font-medium text-white">{{ t('footer.dovesiamo.provincia') }}</span> {{ t('footer.dovesiamo.provinciaValue') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer bar -->
    <div class="max-w-7xl mx-auto border-t border-gray-800 pt-6 pb-8 sm:pb-12">
      <div class="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8">
        <!-- Social -->
        <div class="text-center lg:text-left order-2 lg:order-1">
          <p class="text-sm sm:text-base text-white mb-3 sm:mb-4">{{ t('footer.social.title') }}</p>
          <div class="flex items-center justify-center lg:justify-start gap-4 pb-4 border-b border-white/20 lg:border-b-0">
               <a href="https://www.instagram.com/mycars_bergamo?igsh=M3A4amx3M3JzZXEw" class="hover:scale-110 transition-transform">
              <img src="/static/icons/ig.png" alt="Instagram" class="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <!-- <a href="#" class="hover:scale-110 transition-transform">
              <img src="/static/icons/fb.png" alt="Facebook" class="w-6 h-6 sm:w-7 sm:h-7" />
            </a>-->
            <!--<a href="#" class="hover:scale-110 transition-transform">
              <img src="/static/icons/x.png" alt="X" class="w-6 h-6 sm:w-7 sm:h-7" />
            </a>-->
  
           <!-- <a href="#" class="hover:scale-110 transition-transform">
              <img src="/static/icons/link.png" alt="LinkedIn" class="w-6 h-6 sm:w-7 sm:h-7" />
            </a>-->
           <!-- <a href="#" class="hover:scale-110 transition-transform">
              <img src="/static/icons/yt.png" alt="YouTube" class="w-6 h-6 sm:w-7 sm:h-7" />
            </a>-->
          </div>
        </div>

        <!-- Copyright e link -->
        <div class="text-xs sm:text-sm text-gray-500 text-center order-1 lg:order-2">
          <p class="mb-2 sm:mb-3">{{ t('footer.copyright.text', { year: new Date().getFullYear() }) }}</p>
          <div class="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <NuxtLink to="/cookie" class="hover:text-[#A30000] transition-colors">{{ t('footer.copyright.links.cookie') }}</NuxtLink>
            <NuxtLink to="/privacy" class="hover:text-[#A30000] transition-colors">{{ t('footer.copyright.links.privacy') }}</NuxtLink>
            <NuxtLink to="/termini" class="hover:text-[#A30000] transition-colors">{{ t('footer.copyright.links.termini') }}</NuxtLink>
          </div>
        </div>

        <!-- Logo -->
<div class="text-center lg:text-right order-3">
  <a href="/">
    <img src="/static/images/mycarslogo.png" alt="MyCars Logo" class="h-6 sm:h-8 mx-auto lg:mx-0" />
  </a>
</div>

      </div>
    </div>
  </footer>
</template>

<style scoped>
.input {
  background-color: #111;
  border: 1px solid #444;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #A30000;
  box-shadow: 0 0 0 2px rgba(163, 0, 0, 0.2);
}

.input::placeholder {
  color: #9CA3AF;
}

@media (min-width: 640px) {
  .input {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
