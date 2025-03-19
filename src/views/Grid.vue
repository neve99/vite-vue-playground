<template>
  <div class="container">
    <div class="header">
      <h1>Smooth Scroll Grid</h1>
      <p>Scroll down to experience smooth scrolling</p>
    </div>
    
    <div class="grid">
      <!-- Create grid items -->
      <div class="grid-item" v-for="i in 20" :key="i">
        <div class="card">
          <h2>Item {{ i }}</h2>
          <p>This is grid item {{ i }} with smooth scrolling</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
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

  // Optional: add event listeners for scroll events
  lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    console.log({ scroll, limit, velocity, direction, progress });
  });
})

onBeforeUnmount(() => {
  // Clean up Lenis instance when component is unmounted
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
});

</script>

<style scoped>
/* Basic styles for demonstration */
.container {
  width: 100%;
  min-height: 300vh; /* Make page scrollable */
  padding: 2rem;
}

.header {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.grid-item {
  min-height: 300px;
}

.card {
  height: 100%;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
}

/* Make sure all elements use transforms for better Lenis performance */
html.lenis {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
</style>