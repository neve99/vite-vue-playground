<template>
  <div class="cube"  @click="moveX">

  </div>
</template>

<script setup>
import { gsap } from 'gsap'
const moveX = () => {
  
  gsap.to('.cube', { top:'calc(10vh + 100px)', duration: 1, ease: 'power1.inOut', })
}

</script>


<style>
.cube {
  width: 100px;
  height: 100px;
  background-color: red;

  position: absolute;
  top: 50%;
  left: 50%;

  z-index: 100;
  cursor: pointer;
}
</style>