<template>
  <div class="container">
    
    <div class="hero">
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi ipsam totam ratione blanditiis saepe consequuntur cumque laboriosam tenetur dolor, sed id voluptatem, placeat, deserunt reiciendis voluptatibus! Ab reiciendis, quas inventore, molestias, accusamus saepe cum qui itaque molestiae obcaecati ut. Consectetur, tempore quaerat aliquam unde, temporibus fugiat necessitatibus ab iste dignissimos deserunt perspiciatis voluptatibus facere veritatis dolore ipsam. Culpa, voluptatibus commodi voluptates officiis assumenda qui dicta doloribus delectus officia ab harum perspiciatis repellat blanditiis laboriosam ipsa impedit dolore voluptate sed quae dignissimos architecto? Minima quo nemo perferendis inventore dolore molestias, nisi mollitia. Eos quaerat consequuntur veritatis dicta deleniti iusto at quis.</p>
      <p>test</p>
      <h1>title</h1>
    </div>

    <!-- Grid Overlay (togglable) -->
    <div class="grid-overlay" v-if="showGrid">
      <div v-for="i in 12" :key="`grid-col-${i}`" class="grid-column"></div>
    </div>
    
    <!-- Toggle Button -->
    <button class="grid-toggle" @click="toggleGrid">
      <!-- {{ showGrid ? 'Hide' : 'Show' }} Grid -->
    </button>

  </div>


</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Lenis from '@studio-freight/lenis'

let lenis = null
const showGrid = ref(false)

// toggle grid overlay
const toggleGrid = () => {
  showGrid.value = !showGrid.value
}


// function to update scrolling
const raf = (time) => {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

onMounted(() => {
  lenis = new Lenis({
    duration: 0.5,
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
  --gap: 0.8vw;
  --padding-desktop: 1.2vw;


  width: 100%;
  min-height: 300vh;
  font-size: 1.5vw;
  padding: var(--padding-desktop);
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gap);
  
}


p {
  font-size: 1em;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  
}

h1 {
  font-size: 3em;
  font-weight: 900;
}

.hero{
  grid-column: 7 / 13;

  border: 1px solid #ddd;
  height: 100vh;
  margin-bottom: 1.2vw;
  position: relative;
  z-index: 1;
}

.hero p {
  grid-column: 2 / span 10;
}



/* Grid Overlay Styles */
.grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gap);
  padding: 0 var(--padding-desktop);
  pointer-events: none;
  z-index: 9999;
}

.grid-column {
  height: 100%;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.grid-toggle {
  position: fixed;
  bottom: 1.2vw;
  right: 1.2vw;
  padding: 16px 16px;
  outline: none;
  height: 16px;
  width: 16px;
  background: #fff;
  color: white;
  border: none;
  border-radius: 0px;
  cursor: pointer;
  z-index: 10000;



  mix-blend-mode: difference;
}
</style>