<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TheCard from '@/components/TheCard.vue';
import TheTestCube from '@/components/TheTestCube.vue';
import { gsap } from 'gsap'
const zIndexCounter = ref(1)
const activeCardId = ref(null) // Reactive property to track the active card
const getNextZIndex = () => {
  return ++zIndexCounter.value
}
const setActiveCard = (id) => {
  activeCardId.value = id
}
const handleClickOutside = (event) => {
  if (!event.target.closest('.card')) {
    activeCardId.value = null
    console.log('click outside')
  }
}



onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>

  <div>
    <TheCard :get-next-z-index="getNextZIndex" :set-active-card="setActiveCard" :active-card-id="activeCardId" card-id="1"/>
    <TheCard :get-next-z-index="getNextZIndex" :set-active-card="setActiveCard" :active-card-id="activeCardId" card-id="2"/>
    <TheCard :get-next-z-index="getNextZIndex" :set-active-card="setActiveCard" :active-card-id="activeCardId" card-id="3"/>

    <!-- <TheTestCube /> -->
    <h1>Home</h1>
    <p>Welcome to your new project!</p>

  </div>
</template>
