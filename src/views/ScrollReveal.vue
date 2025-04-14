<template>
  <div class="screen-reveal-container">
    <section class="intro">
      <h1>Design that Captivates</h1>
      <p>( Explore Below )</p>
    </section>
    <section class="work">
      <!-- loop through 10 rows -->
      <div class="row" v-for="(row, rowIndex) in rows" :key="`row-${rowIndex}`">
        <!--loop through 4 columns in each row-->
        <div
          class="col"
          v-for="(cell, colIndex) in row"
          :key = "`cell-${rowIndex}-${colIndex}`"
          >
          <!-- show image only if this cell has hasImage=true -->
          <img class="img"
            v-if="cell.hasImage"
            :src="cell.imageUrl"
            :alt="`Image ${rowIndex}-${colIndex}`"
            :data-origin="cell.origin"
          />
        </div>
      </div>
    </section>
    <section class="outro">
      <p>( Return to Top )</p>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { useScroll } from '@vueuse/core'
import { useWindowSize } from '@vueuse/core'

gsap.registerPlugin(ScrollTrigger)
const lenis = new Lenis 
const { x, y } = useScroll(window)
const { width, height } = useWindowSize()



// generate 10 rows, each with 4 columns
const rows = ref(
  Array.from({ length: 10 }, (_, rowIndex) => {
    // For each row, create 4 columns
    return Array.from({ length: 4 }, (_, colIndex) => {
      // Randomly determine if this cell has an image (50% chance)
      const hasImage = Math.random() > 0.5;
      
      // Calculate a unique image index for this cell
      // Using (rowIndex * 4 + colIndex) ensures each cell gets a different image
      const uniqueIndex = (rowIndex * 4 + colIndex) 

      // Randomly choose "left" or "right" for data-origin
      const origin = Math.random() > 0.5 ? "left" : "right";
      
      // If it has an image, use the deterministic image index
      return {
        hasImage,
        imageUrl: hasImage ? `https://picsum.photos/800/800?random=${uniqueIndex}` : '',
        origin
      };
    });
  })
)

const cleanup = () => {
  // Clean up Lenis
  if (lenis) {
    // Remove GSAP ticker callback
    gsap.ticker.remove(lenis.raf);
    
    // Destroy Lenis instance
    lenis.destroy();
  }

  // Kill all ScrollTrigger instances
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

onMounted (() => {

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  })

  // since lenis is hanlding the scroll, we need to disable the lag smoothing behavior of gsap
  gsap.ticker.lagSmoothing(0)
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.screen-reveal-container {
  color: black;
  background-color: #fff;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  text-transform: uppercase;
  text-align: center;
  font-size: 10vw;
  font-weight: 400;
}

p {
  text-transform: uppercase;
  font-family: monospace;
  font-size: 13px;
}

.intro, .outro {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #101214;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4em;
  overflow: hidden;
}

.work {
  position: relative;
  width: 100vw;
  overflow: hidden;
  background-color: #1a1d20;
}

.row {
  width: 100vw;
  display: flex;
}

.col {
  flex: 1;
  aspect-ratio: 1;
}

.img {
  position: relative;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.img[data-origin="left"] {
  transform-origin: 0% 0%;
}

.img[data-origin="right"] {
  transform-origin: 100% 0%;
}

</style>