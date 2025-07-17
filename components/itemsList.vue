<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

// get all items from items collection in firestore
const items = ref([])

onMounted(async () => {
    const itemsRef = collection(db, 'items')
    const itemsSnapshot = await getDocs(itemsRef)
    itemsSnapshot.forEach((doc) => {
        items.value.push({ id: doc.id, ...doc.data() })
    })
})
</script>

<template>
    <section class="text-black">   
        <h1>Items List</h1>
        <div v-for="item in items" :key="item.id">
            <div class="item ">
                <h2>{{ item.name }}</h2>
            </div>
        </div>
    </section>
</template>

<style scoped>
.items-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
</style>