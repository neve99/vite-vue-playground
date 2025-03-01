<!-- 
Todo:
- make draw arc also has a interval
- make draw with other vectors
-->


<!-- 


TEMPLATE 


-->
<template>
  <div class="cursor" ref="cursor">
    <div class="cursor-circle" ref="cursorCircle"></div>
    <!-- <img src="/cross100.svg" class="cross"/> -->
    <div class="cross-ctn">
      <div class="horizontal"></div>
      <div class="vertical"></div>
    </div>
    <img src="/images/mg-pov.png" class="mg" ref="mg">
    <span class="cursor-text" ref="cursorText">this is cool</span>
  </div>
  <h1 class="test">Scratch me</h1>
  
  <section class="scratched-in">
    <canvas class="in" ref="canvas"></canvas>
  </section>
</template>
<!-- 


SCRIPT 


-->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const cursor = ref(null)
const cursorText = ref(null)
const cursorCircle = ref(null)
const fadeInTrigger = ref(false)
const canvas = ref(null)
const isMouseDown = ref(false)
const audio = ref(null)
const soundInterval = ref(null)
const lastPosition = ref({ x: 0, y: 0 })
const canDraw = ref(true)
const mg = ref(null)

const handleMouseMove = (e) => {
  if (!fadeInTrigger.value) {
    fadeInTrigger.value = true
    gsap.to(cursor.value, { opacity: 1, duration: 0.1, delay: 0.1 })
  }
  gsap.to(cursor.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.2,
  })

  // Store the current mouse position regardless of whether we can draw
  lastPosition.value = { 
    x: e.clientX,
    y: e.clientY
  }

  // Only erase if mouse is down AND we're allowed to draw
  if (isMouseDown.value && canDraw.value) {
    erase(canvas.value, e)
    canDraw.value = false
  }
}

const handleMouseDown = (e) => {

  isMouseDown.value = true

  
  gsap.to(cursorText.value, {
    innerText: 'release me plz',
  })

  // Allow immediate drawing and sound on first click
  canDraw.value = true
  erase(canvas.value, e)
  playEraseSound()
  
  // Variables for managing our own timing
  let lastTime = 0;
  const interval = 100; // 100ms interval
  let animationFrame;
  
  // Set up interval for both sound and drawing
  soundInterval.value = setInterval(() => {
    // Reset cursor scale first
    gsap.set(cursorCircle.value, {
      scale: 1
    })
    
    // Then animate it growing
    gsap.to(cursorCircle.value, {
      scale: 15.5,
      duration: 0.1,
    })

     // First reset the mg position
    gsap.set(mg.value, {
      x: 0,
      y: 0
    })
    
    // Then animate mg to move back 50px in both x and y directions
    gsap.to(mg.value, {
      x: 20, // Use negative value to move back in x direction
      y: 20, // Use negative value to move back in y direction
      duration: 0.1,
    })

    // Enable drawing for the next move event
    canDraw.value = true
    
    // If mouse hasn't moved, draw at last position
    if (isMouseDown.value && lastPosition.value) {
      const simulatedEvent = {
        clientX: lastPosition.value.x,
        clientY: lastPosition.value.y
      }
      erase(canvas.value, simulatedEvent)
    }
    
    // Play sound with each interval
    playEraseSound()
  }, 250)
}

const handleMouseUp = () => {
  isMouseDown.value = false
  gsap.to(cursorCircle.value, {
    scale: 1,
    duration: 0.1,
  })
  gsap.to(cursorText.value, {
    innerText: 'this is cool',
  })

  // Clear the interval to stop playing sounds
  if (soundInterval.value) {
    clearInterval(soundInterval.value)
    soundInterval.value = null
  }
}

const setupCanvas = (canvas) => {
  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = window.devicePixelRatio

  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  // Draw the surface image
  const surfaceImage = new Image()
  surfaceImage.src = '/images/scraping-out.jpeg'
  surfaceImage.onload = () => {
    ctx.drawImage(surfaceImage, 0, 0, w, h)
  }
}
// Create and initialize the audio element
const createAudio = () => {
  audio.value = new Audio('/mp3/MG.mp3')
  audio.value.volume = 0.5 // Set volume to 50%
}

// Play audio function
const playEraseSound = () => {
  if (audio.value) {
    // Create a clone of the audio to allow overlapping sounds
    const soundClone = audio.value.cloneNode()
    soundClone.volume = 0.5
    soundClone.play()
  }
}
const erase = (canvas, e) => {

  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left)
  const y = (e.clientY - rect.top)



  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(x, y, 20, 0, Math.PI * 2, false)
  ctx.fill()

  
}

onMounted(() => {

  document.body.classList.add('hide-cursor')
  gsap.set(cursor.value, { opacity: 0 })


  // Initialize audio
  createAudio()

  if (canvas.value) {
    setupCanvas(canvas.value)
    canvas.value.addEventListener('mousemove', handleMouseMove)
    canvas.value.addEventListener('mousedown', handleMouseDown)
    canvas.value.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('resize', () => {
      setupCanvas(canvas.value)
    })
  }
})

onUnmounted(() => {

  document.body.classList.remove('hide-cursor')

  // Make sure to clear the interval when component is unmounted
  if (soundInterval.value) {
    clearInterval(soundInterval.value)
    soundInterval.value = null
  }
  
  if (canvas.value) {
    canvas.value.removeEventListener('mousemove', handleMouseMove)
    canvas.value.removeEventListener('mousedown', handleMouseDown)
    canvas.value.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('resize', () => {
      setupCanvas(canvas.value)
    })
  } 

})
</script>
<!-- 


STYLE 


-->
<style scoped>
.cursor {
  position: fixed;
  pointer-events: none;
  mix-blend-mode: difference;
  top: 0px;
  left: 0px;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
.cursor span {
  box-sizing: border-box;
  position: absolute;
  top: 120px;
  left: 40px;
  width: auto;
  white-space: nowrap;
  font-size: 14px;
  color: white;
  font-weight: bold;
  pointer-events: none;
  user-select: none;
  text-align: left;
}
.cursor-circle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  pointer-events: none;
  mix-blend-mode: difference;
  top: 0px;
  left: 0px;
  transform: translate(-50%, -50%);
}
.cursor img {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  user-select: none;
}
.cursor img.mg {
  width: 100px;
  height: 100px;
  top: 60px;
  left: 50px;
  mix-blend-mode: difference;
}
.cursor img.cross {
  
  mix-blend-mode: difference;
}
.cross-ctn {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
.horizontal{
  position: absolute;
  height: 1px;
  width: 100%;
  background-color: white;
}
.vertical{
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: white;
}
.test {
  user-select: none;
  color: #d4d4d4;
}
canvas.in {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/scraping-bg.jpeg');
  background-size: repeat;
  z-index: -2;
}
</style>

<style>
/* Global style to hide cursor when .hide-cursor class is present on body */
body.hide-cursor {
  background-color: red;
  cursor: none;
}
</style>