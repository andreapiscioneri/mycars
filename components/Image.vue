<script setup>

const props = defineProps({
    src: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="image">
        <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-cover"/>
        <div v-else class="w-full h-full bg-gray-300 border flex items-center justify-center">
            <span class="text-gray-500 text-sm">No image</span>
        </div>
    </div>
</template>

<style scoped>

</style>