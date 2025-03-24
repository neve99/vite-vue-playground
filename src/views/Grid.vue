<template>
  <div class="container" ref="container">
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
        <p>Hi, my name is Yang, I am a multi-disciplinary designer and developer based in Bremen. Currently available for freelance work.
        </p>
        <!-- <div class="hero__color-block--green"></div>
        <div class="hero__color-block--blue"></div> -->
        <p class="contact">ig: @somet.zip <br>email: yanliu@hfk-bremen.de</p>
        <div class="hero--subtitle">
          <h2 class="hero--subtitle--1">
            Design & Development
          </h2>
          <h2 class="hero--subtitle--2">
            Based in Bremen
          </h2>
          <h2 class="hero--subtitle--3">
            Study at HFK Bremen
          </h2>
        </div>
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
import { parse } from 'vue/compiler-sfc'

let lenis = null

const container = ref(null)
const showGrid = ref(false)
const gridColumns = ref([])
const gridToggle = ref(null)
const grabberRef = ref(null)
const grabberPosition = ref({ x: 40.25, y:18.01 })

const grabberTop = ref(null)
const grabberLeft = ref(null)

const heroTitle = ref(null)

// get css variable
const getCssVar = (name) => {
  if (!container.value) return
  const styles = getComputedStyle(container.value)
  return styles.getPropertyValue(name).trim()
}

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
        duration: 1.3,
        stagger: 0.02,
        ease: 'power4.out',
      })
    })
  } else {
    // animate out before hiding
    gsap.to(gridColumns.value, {
      y: window.innerHeight,
      width: '0.1%',
      duration: 0.8,
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
const updateFocusLines = () => {
  // get current position in pixels
  const rect = grabberRef.value.getBoundingClientRect()
  const grabberCenterX = rect.left + rect.width / 2 - 1
  const grabberCenterY = rect.top + rect.height / 2 - 1

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
  const grabberTopValue = parseFloat(grabberTop.value)
  const grabberLeftValue = parseFloat(grabberLeft.value)

  gsap.set ('.focus__line--horizontal', {
    top: `${grabberPosition.value.y}vh`
  })

  gsap.set ('.focus__line--vertical', {
    left: `${grabberPosition.value.x}vw`
  })

  // update blur effect and opacity
  gsap.to ('.hero--title', {
    filter: `blur(${Math.abs(grabberPosition.value.x - grabberTopValue) * 0.005}em)`,
    opacity: 1 - Math.abs(grabberPosition.value.x - grabberTopValue) * 0.03,
    duration: 0.5,
  })

  gsap.to ('.hero--subtitle', {
    filter: `blur(${Math.abs(grabberPosition.value.y - grabberLeftValue) * 0.01}em)`,
    duration: 0.5,
  })
  


}

onMounted(() => {
  //access css variables
  grabberTop.value = getCssVar('--grabber-top')
  grabberLeft.value = getCssVar('--grabber-left')


  // Initialize Lenis instance
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
    onDrag: updateFocusLines,
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
        duration: 0.3,s
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

  --grabber-top: 50vh;
  --grabber-left: 25.4vw;
  /* --grabber-left: calc(25vw + 0.4vw) ; */
  --grabber-color: #E92E07;

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

h2 {
  font-size: 5.2em;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: .8;
  color: #a8a8a8;
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
  pointer-events: none;
}
header a {
  color: #fff;
  user-select: none;
  pointer-events: auto;

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
  height: calc(100vh - 0.2em);
  max-height: 70vw;
  min-height: 20vw;
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
.hero--top{
  pointer-events: none;
  position: absolute;
  top: 0;
  border: #000 1px solid;
}
.hero--bottom{
  position: absolute;
  bottom: 0;
}
.hero--top p {
  grid-column: 7 / 13;
  padding-top: calc(2 * var(--padding) + 10vh);
  /* padding-bottom: var(--padding); */
  pointer-events: auto;
}
p.contact {
  /* padding-top: 5vw; */
}
.hero h1 {
  grid-column: 1 / 13;
  grid-row: 3; /* Third row, which is at the bottom */
  align-self: end; /* Align to the end of the row */
  margin-bottom: var(--padding); /* Optional: add some bottom padding */
  filter: drop-shadow(0 0 0.00em rgba(0, 0, 0, 0.7)) blur(0.00em); 

  z-index: 2;
}
.hero--subtitle {
  position: absolute;
  top: 2vw;
  grid-column: 1 / 13;

  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: min-content;
  column-gap: var(--gap);
  row-gap: 0;
  padding-bottom: var(--padding);
  z-index: -1;
  filter: blur(0.25em);

  text-transform: uppercase;

}

.hero--subtitle--1 {
  grid-column: 1 / 13;
  grid-row: 1;

}
.hero--subtitle--2 {
  grid-column: 1 / 13;
  grid-row: 2;

}
.hero--subtitle--3 {
  grid-column: 1 / 13;
  grid-row: 3;

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
  /* background-color: rgba(255, 0, 0, 0.1); */
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
  top: var(--grabber-top);
  left: var(--grabber-left);
  right: 0;
  width: 6em;
  height: 6em;
  transform: translate(-50%, -50%);
  background-color: #E92E07;

  z-index: 9999;
  pointer-events: auto;
  filter: blur(0em);

}

.focus__line--horizontal {
  /* display: none; */
  position: fixed;
  top: var(--grabber-top);
  left: 0;
  height: 0px;
  width: 100vw;
  /* background-color: #E92E07; */
  border-bottom: var(--grabber-color) 1px dashed;


  z-index: 9999;
}

.focus__line--vertical {
  /* display: none; */
  position: fixed;
  top: 0;
  left: var(--grabber-left);
  width: 0px;
  height: 100vh;
  /* background-color: #E92E07; */
  border-left: var(--grabber-color) 1px dashed;

  /* background-color: #8d1801; */
  /* background-color: #00831c; */

  z-index: 9999;
}
</style>