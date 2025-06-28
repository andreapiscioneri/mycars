<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = ref('')
const pass = ref('')
const router = useRouter()

const users = [
  { username: 'admin', password: '1234' },
  { username: 'andrypiscioneri@gmail.com', password: 'andrea' }
]

const login = () => {
  const match = users.find(
    (u) => u.username === user.value && u.password === pass.value
  )

  if (match) {
    localStorage.setItem('auth', 'true')
    localStorage.setItem('user', user.value)
    router.push('/area-riservata')
  } else {
    alert('Credenziali errate')
  }
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto mt-20">
    <h1 class="text-xl font-bold mb-4">Login Area Riservata</h1>
    <input v-model="user" placeholder="Email o Username" class="border px-4 py-2 mb-2 w-full" />
    <input v-model="pass" type="password" placeholder="Password" class="border px-4 py-2 mb-4 w-full" />
    <button @click="login" class="bg-black text-white px-4 py-2">Login</button>
  </div>
</template>
