<script setup>
import { ref } from 'vue'
import TheCard from '@/components/TheCard.vue';
const zIndexCounter = ref(1)
const getNextZIndex = () => {
  return ++zIndexCounter.value
}
</script>

<template>

  <div>
    <TheCard :get-next-z-index="getNextZIndex" />
    <TheCard :get-next-z-index="getNextZIndex" />
    <TheCard :get-next-z-index="getNextZIndex" />
    <h1>Home</h1>
    <p>Welcome to your new project!</p>
  </div>
</template>
