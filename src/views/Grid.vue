<template>
  <div class="container">
    <header>
      <a href="#" class="header__link--home">somet.zip</a>
      <a href="#" class="header__link--about">about</a>
      <a href="#" class="header__link--index">index</a>
    </header>
    
    <div class="hero">
      <div class="hero--top">
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi ipsam totam ratione blanditiis saepe consequuntur cumque laboriosam tenetur dolor, sed id voluptatem, placeat, deserunt reiciendis voluptatibus! Ab reiciendis, quas inventore, molestias, accusamus saepe cum qui itaque molestiae obcaecati ut. Consectetur, tempore quaerat aliquam unde, temporibus fugiat necessitatibus ab iste dignissimos deserunt perspiciatis voluptatibus facere veritatis dolore ipsam. Culpa, voluptatibus commodi voluptates officiis assumenda qui dicta doloribus delectus officia ab harum perspiciatis repellat. 
        </p>
        <div class="hero__color-block--green"></div>
        <div class="hero__color-block--blue"></div>
        <p>16379204648 <br>loremipsum@info.com</p>
      </div>
      <div class="hero--bottom">
        <h1>somet.zip</h1>
      </div>
    </div>

    <!-- Grid Overlay (togglable) -->
    <div class="grid-overlay" v-if="showGrid">
      <div v-for="i in 12" :key="`grid-col-${i}`" class="grid-column" ref="gridColumns"></div>
    </div>
    
    <!-- Toggle overlay button -->
    <button class="grid-toggle" @click="toggleGrid" ref="gridToggle" @mouseover="toggleBtnRotation">
      <!-- {{ showGrid ? 'Hide' : 'Show' }} Grid -->
    </button>

  </div>


</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import Lenis from '@studio-freight/lenis'

let lenis = null
const showGrid = ref(false)
const gridColumns = ref([])
const gridToggle = ref(null)

// toggle grid overlay
const toggleGrid = () => {
  if (!showGrid.value) {
    // ENTERING: Set showGrid first, then animate after DOM update
    showGrid.value = true;
    // Wait for next DOM update
    nextTick().then(() => {
      gsap.set(gridColumns.value,{
        y: -window.innerHeight,
      })
      gsap.to(gridColumns.value, {
        y: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power4.out',
      })
    })
  } else {
    // animate out before hiding
    gsap.to(gridColumns.value, {
      y: window.innerHeight,
      duration: 0.5,
      ease: 'power4.in',
      stagger: {
        each: 0.02,
        from: 'end',
      },
      onComplete: () => {
        showGrid.value = false;
      }
    })
  }
}
const toggleBtnRotation = () => {
  gsap.set(gridToggle.value, {
    rotate: 0,
  })
  gsap.to(gridToggle.value, {
    rotate: 90,
    duration: 0.5,
    ease: 'power4.out',
  })
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
  /* lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    console.log({ scroll, limit, velocity, direction, progress });
  }); */
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
  --padding: 1.2vw;
  /* --border-color-helper: #ddd; */


  width: 100%;
  min-height: 300vh;
  font-size: 1.5vw;
  padding: var(--padding);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--gap);
  
  background: #CCD0D1;
}


p {
  font-size: 1em;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  
  overflow-wrap: break-word;
  hyphens: auto;

  color: #000;
}

h1 {
  font-size: 15.2em;
  font-weight: 900;
  letter-spacing: -0.04em;

  color: #2a2a2a;
  filter: drop-shadow(0 0 0.03em rgba(0, 0, 0, 0.7)) ;
}

a {
  font-size: 1em;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: #000;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  padding: var(--padding);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gap);
  mix-blend-mode: difference;  
  z-index: 10000;
}
header a {
  color: #fff;

}
.header__link--home {
  grid-column: 1;
}
.header__link--about {
  grid-column: 7;
}
.header__link--index {
  justify-self: end;
  grid-column: 12;
  text-align: right;
}


.hero{
  position: relative;

  grid-column: span 12;

  border: 1px solid var(--border-color-helper);
  height: calc(100vh - var(--padding));
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Push elements to top and bottom */
}

.hero div {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: min-content;
  column-gap: var(--gap);
  border: 1px solid var(--border-color-helper);

}
.hero__color-block--green {
  grid-column: 7 / span 6;
  height: 16px;
  background-color: #00ff00;
}
.hero__color-block--blue {
  grid-column: 7 / span 6;
  height: 32px;
  background-color: #008cff;
}
.hero--top p {
  grid-column: 7 / 13;
  padding-top: calc(2 * var(--padding));
  padding-bottom: var(--padding);
}
.hero h1 {
  grid-column: 1 / 13;
  grid-row: 3; /* Third row, which is at the bottom */
  align-self: end; /* Align to the end of the row */
  margin-bottom: var(--padding); /* Optional: add some bottom padding */

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
  padding: 0 var(--padding);
  pointer-events: none;
  z-index: 9999;
}

.grid-column {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.grid-toggle {
  position: fixed;
  bottom: 1.2vw;
  right: 1.2vw;
  padding: 1em;
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