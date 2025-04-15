<template>
  <div class="screen-reveal-container">
    <section class="intro">
      <h1>Design that Captivates</h1>
      <p>( Explore Below )</p>
    </section>
    <section class="work">
      <!-- loop through 10 rows -->
      <div class="row" ref="rowRef" v-for="(row, rowIndex) in rows" :key="`row-${rowIndex}`">
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

const rowRef = ref(null)


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

const initializeLenis = () => {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  })

  // since lenis is hanlding the scroll, we need to disable the lag smoothing behavior of gsap
  gsap.ticker.lagSmoothing(0)
}

const imgAnimate = () => {
  // set force3D to true to ensure GPU acceleration
  gsap.set('.img', {
    scale: 0,
    force3D: true,
  })

  const rowsArray = document.querySelectorAll('.row')
  rowsArray.forEach((row, index) => {
    const rowImages = row.querySelectorAll('.img')

    if (rowImages.length > 0) {
      row.id = `row-${index}`

      ScrollTrigger.create({
        id: `scaleIn-${index}`,
        trigger: row,
        start:'top bottom', // animation begins when top of the row hits the bottom of the viewport
        end: 'bottom bottom-=10%', // animation ends when the bottom of the row hits the bottom minus 10% of the viewport
        scrub: 1, // the animation will follow the scroll
        invalidateOnRefresh: true, // the animation will be recalculated on refresh
        onUpdate: function (self) { // check if the row is in view
          if (self.isActive) {
            const progress = self.progress;
            const easedProgress = Math.min(1, progress * 1.5); // Easing effect, give the scroll a more natural feel
            const scaleValue = gsap.utils.interpolate(0, 1, easedProgress); // Interpolate scale value

            rowImages.forEach((img) => {
              gsap.set(img, {
                scale: scaleValue,
                force3D: true,
              })
            })

            // prevent inconsistent jittery 
            if(progress > 0.95) {
              gsap.set(rowImages, {scale: 1, force3D: true})
            }
          }
        },
        // define what happens when the row is out of view
        onLeave: function () {
          gsap.set(rowImages, {scale: 1, force3D: true})
        }
      })

      // handle scale out animation
      ScrollTrigger.create({
        id: `scaleOut-${index}`,
        trigger: row,
        start: 'top top',
        end: 'bottom top',
        pin: true, // pin the row in place for a brief moment to make the scroll smoother
        pinSpacing: false, // prevent the row from pushing the content below it
        scrub: 1, // the animation will follow the scroll
        invalidateOnRefresh: true, // the animation will be recalculated on refresh
        onEnter: function () {
          gsap.set(rowImages, {scale: 1, force3D: true})
        },
        onUpdate: function(self) {
          if (self.isActive) {
            const scale = gsap.utils.interpolate(1, 0, self.progress)
            
            rowImages.forEach((img) => {
              gsap.set(img, {
                scale: scale,
                force3D: true,
                clearProps: self.progress === 1 ? 'scale' : '', // clear the scale property when the animation is done
              })
            })
          } else {
            const isAbove = self.scroll() < self.start; // check if the row is above the viewport
            if (isAbove) { 
              gsap.set(rowImages, {
                scale: 1,
                force3D: true,
              })
            }
          }
        }
      })

      // enforce the scale out animation when the row is out of view, add another scroll trigger as safety measure
      /* ScrollTrigger.create({
        id: `marker-${index}`,
        trigger: row,
        start: 'bottom bottom',
        end: 'top top',
        onEnter: function () {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0 ) {
            gsap.set(rowImages, {scale: 1, force3D: true})
          }
        },
        onLeave: function() {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImages, {scale: 1, force3D: true})
          }
        },
        onEnterBack: function () {
          const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`);
          if (scaleOut && scaleOut.progress === 0) {
            gsap.set(rowImages, {scale: 1, force3D: true})
          }
        },

      }) */
    }
    
  })

}

const handleResize = () => {
  ScrollTrigger.refresh(true)
}

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
  // Remove event listeners
  window.removeEventListener('resize', handleResize);
}


onMounted (() => {
  initializeLenis()
  imgAnimate()
  window.addEventListener('resize', handleResize)
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