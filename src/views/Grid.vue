<template>
  <div class="container">
    <header>
      <a href="#" class="header__link--home">somet.zip</a>
      <a href="#" class="header__link--about">about</a>
      <a href="#" class="header__link--index">index</a>
    </header>
    <div class="focus">
      <div class="grabber" ref="grabberRef"></div>
      <div class="focus__line--horizontal"></div>
      <div class="focus__line--vertical"></div>
    </div>
    <div class="hero">
      <div class="hero--top">
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi ipsam totam ratione blanditiis saepe consequuntur cumque laboriosam tenetur dolor, sed id voluptatem, placeat, deserunt reiciendis voluptatibus! Ab reiciendis, quas inventore, molestias, accusamus saepe cum qui itaque molestiae obcaecati ut. Consectetur, tempore quaerat aliquam unde, temporibus fugiat necessitatibus ab iste dignissimos deserunt perspiciatis voluptatibus facere veritatis dolore ipsam. Culpa, voluptatibus commodi voluptates officiis assumenda qui dicta doloribus delectus officia ab harum perspiciatis repellat. 
        </p>
        <div class="hero__color-block--green"></div>
        <div class="hero__color-block--blue"></div>
        <p>16379204648 <br>loremipsum@info.com</p>
      </div>
      <div class="hero--bottom">
        <h1 ref="heroTitle" class="hero--title">somet.zip</h1>
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
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)
import Lenis from '@studio-freight/lenis'

let lenis = null
const showGrid = ref(false)
const gridColumns = ref([])
const gridToggle = ref(null)

const grabberRef = ref(null)
const grabberPosition = ref({ x: 40.25, y:18.01 })

const heroTitle = ref(null)

// toggle grid overlay
const toggleGrid = () => {
  if (!showGrid.value) {
    // ENTERING: Set showGrid first, then animate after DOM update
    showGrid.value = true;
    // Wait for next DOM update
    nextTick().then(() => {
      gsap.set(gridColumns.value,{
        y: -window.innerHeight,
        width: '0',
      })
      gsap.to(gridColumns.value, {
        y: 0,
        width: '100%',
        duration: 0.5,
        stagger: 0.02,
        ease: 'power4.out',
      })
    })
  } else {
    // animate out before hiding
    gsap.to(gridColumns.value, {
      y: window.innerHeight,
      width: '0.1%',
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

//update focus lines
const updateFoucusLines = () => {
  // get current position in pixels
  const rect = grabberRef.value.getBoundingClientRect()
  const grabberCenterX = rect.left + rect.width / 2
  const grabberCenterY = rect.top + rect.height / 2

  // convert to vw/vh
  const vw = window.innerWidth / 100
  const vh = window.innerHeight / 100

  // update position
  grabberPosition.value = {
    x: grabberCenterX / vw,
    y: grabberCenterY / vh,
  }

  // console.log(grabberPosition.value.x)

  // update lines
  gsap.set ('.focus__line--horizontal', {
    top: `${grabberPosition.value.y}vh`
  })

  gsap.set ('.focus__line--vertical', {
    left: `${grabberPosition.value.x}vw`
  })

  // update blur
  gsap.to ('.hero--title', {
    filter: `blur(${Math.abs(grabberPosition.value.x - 40.25) * 0.01}em)`,
    duration: 0.5,
  })
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

  Draggable.create(grabberRef.value, {
    type: 'x, y',
    bounds: '.focus',
    onDrag: updateFoucusLines,
    /* onPress: function() {
      gsap.to(this.target, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power4.out',
      })
    },
    onRelease: function() {
      gsap.to(this.target, {
        scale: 1,
        duration: 0.3,
        ease: 'power4.out',
      })
    } */
  })
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
  --text-color: #2a2a2a;
  --bg-color: #f5f5f5;
  /* --bg-color: #CDD1D2; */
  --accent-color-1:#E92E07;
  --accent-color-2:#fe4520;
  /* --border-color-helper: #ddd; */


  width: 100%;
  min-height: 300vh;
  font-size: 1.5vw;
  padding: var(--padding);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--gap);
  
  background-color: var(--bg-color);
}


p {
  font-size: 1em;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  
  overflow-wrap: break-word;
  hyphens: auto;

  color: var(--text-color);

  filter: drop-shadow(0 0 0.03em rgba(0, 0, 0, 0.7)) ;


}

h1 {
  font-size: 15.2em;
  font-weight: 900;
  letter-spacing: -0.04em;

  color: var(--text-color);
  
}

a {
  font-size: 1em;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: #000;

  filter: drop-shadow(0 0 0.03em rgba(255, 255, 255, 0.7)) ;
}
/* Custom text selection styling */
::selection {
  background-color: var(--accent-color-1); /* Red background for selected text */
  color: white; /* White text when selected */
  text-shadow: none; /* Remove any text shadows when selected */
  filter: none !important; /* This removes any filter effects including drop shadows */
  -webkit-filter: none !important;
  
}

/* For Firefox which uses a different pseudo-element */
::-moz-selection {
  background-color: var(--accent-color-2);
  color: white;
  text-shadow: none;
  filter: none !important; /* This removes any filter effects including drop shadows */
  -webkit-filter: none !important;
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
  user-select: none;

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
  max-height: 70vw;
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
  height: 1em;
  background-color: #fe4520;
}
.hero__color-block--blue {
  grid-column: 7 / span 6;
  height: 1em;
  background-color: #E92E07;
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
  filter: drop-shadow(0 0 0.00em rgba(0, 0, 0, 0.7)) blur(0.005em); 
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
  background-color: rgba(255, 0, 0, 0.1);
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

  filter: drop-shadow(0 0 0.03em rgba(255, 255, 255, 0.7)) ;
}

.focus{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  mix-blend-mode: hard-light;
  pointer-events: none;
}
.grabber {
  position: fixed;
  top: 18.01vw;
  left: 40.32vw;
  right: 0;
  width: 2em;
  height: 2em;
  background-color: var(--accent-color-1);
  z-index: 9999;
  pointer-events: auto;
  filter: blur(0em);

}

.focus__line--horizontal {
  position: fixed;
  top: calc(18.00vw + 1em);
  left: 0;
  height: 2px;
  width: 100vw;
  background-color: var(--accent-color-1);
  z-index: 9999;
}

.focus__line--vertical {
  position: fixed;
  top: 0;
  left: calc(40.25vw + 1em);
  width: 2px;
  height: 100vh;
  background-color: var(--accent-color-1);
  z-index: 9999;
}
</style>