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
    <img src="/cross100.svg" />
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

  if (isMouseDown.value) {
    erase(canvas.value, e)
  }
}

const handleMouseDown = (e) => {

  isMouseDown.value = true
  erase(canvas.value, e)
  gsap.to(cursorCircle.value, {
    scale: 5.5,
    duration: 0.1,
  })
  gsap.to(cursorText.value, {
    innerText: 'release me plz',
  })

  // Play sound immediately on mouse down
  playEraseSound()
  
  // Set up interval to play sound repeatedly while mouse is down
  // Sound will play every 300ms (adjust as needed)
  soundInterval.value = setInterval(() => {
    playEraseSound()
  }, 100)
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

  setupCanvas(canvas.value)
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
  top: 40px;
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