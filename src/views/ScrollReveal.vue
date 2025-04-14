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
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)


// Generate 10 image URLs using a template
/* const imageUrls = [
  'https://picsum.photos/seed/pic1/500/500',
  'https://picsum.photos/seed/pic2/500/500',
  'https://picsum.photos/seed/pic3/500/500',
  'https://picsum.photos/seed/pic4/500/500',
  'https://picsum.photos/seed/pic5/500/500',
  'https://picsum.photos/seed/pic6/500/500',
  'https://picsum.photos/seed/pic7/500/500',
  'https://picsum.photos/seed/pic8/500/500',
  'https://picsum.photos/seed/pic9/500/500',
  'https://picsum.photos/seed/pic10/500/500',
  ]; */
const imageUrls = Array.from({ length: 20 }, (_, index) => {
  return `https://picsum.photos/800/800?random=${index + 1}`;
});

// generate 10 rows, each with 4 columns
const rows = ref(
  Array.from({ length: 10 }, (_, rowIndex) => {
    // For each row, create 4 columns
    return Array.from({ length: 4 }, (_, colIndex) => {
      // Randomly determine if this cell has an image (50% chance)
      const hasImage = Math.random() > 0.5;
      
      // Calculate a unique image index for this cell
      // Using (rowIndex * 4 + colIndex) ensures each cell gets a different image
      const imageIndex = (rowIndex * 4 + colIndex) % imageUrls.length;

      // Randomly choose "left" or "right" for data-origin
      const origin = Math.random() > 0.5 ? "left" : "right";
      
      // If it has an image, use the deterministic image index
      return {
        hasImage,
        imageUrl: hasImage ? imageUrls[imageIndex] : '',
        origin
      };
    });
  })
)
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