<template>

  <div>
    
    <h1>Home</h1>
    <div >
    </div>  
    <p>Here are the projects:</p>
    <div class="router-links">
      <router-link to="/canvas">Canvas Scraping</router-link>
      <router-link to="/snow">Snow Scraping</router-link>
      <router-link to="/matter">Matter</router-link>
      <router-link to="/line">Line Drawer</router-link>

    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'


</script>

<style scoped>
  .router-links {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: start;
  }

  a {
    font-size: 16px;
    font-weight: 600;
  }
</style>