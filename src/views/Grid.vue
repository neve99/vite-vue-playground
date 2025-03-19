<template>

</template>

<script setup>
import { ref, onMounted, onBeforeMount, nextTick } from 'vue'
import Lenis from '@studio-freight/lenis'

let lenis = null;

// function to update scrolling
const raf = (time) => {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

onMounted(() => {
  lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    easing:(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  })
  
  requestAnimationFrame(raf)
})

</script>

<style scoped>
</style>