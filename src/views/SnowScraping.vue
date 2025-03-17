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
    <span class="cursor-text" ref="cursorText">it's cold outside</span>
  </div>
  <h1 class="test" v-show="hasClicked">I'm free</h1>
  
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
const hasClicked = ref(false)

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
  hasClicked.value = true
  isMouseDown.value = true

  
  gsap.to(cursorText.value, {
    innerText: 'release me',
  })

  // Allow immediate drawing and sound on first click
  canDraw.value = true
  erase(canvas.value, e)
  playEraseSound()
  
  // Variables for managing our own timing
  let lastTime = 0;
  const interval = 100; // 100ms interval
  let animationFrame;

  // Animation function that will be called with requestAnimationFrame
  const animateWithTiming = (timestamp) => {
    if (!isMouseDown.value) return; // Stop if mouse is up
    // Check if enough time has passed for our interval
    if (!lastTime || timestamp - lastTime >= interval) {
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
      x: 20,
      y: 20
    })
    
    // Then animate mg to move back 50px in both x and y directions
    gsap.to(mg.value, {
      x: 0, // Use negative value to move back in x direction
      y: 0, // Use negative value to move back in y direction
      duration: 0.1,
    })

    // Enable drawing for the next move event
    canDraw.value = true
    
    // Draw at last position
    if (lastPosition.value) {
        const simulatedEvent = {
          clientX: lastPosition.value.x,
          clientY: lastPosition.value.y
        };
        erase(canvas.value, simulatedEvent);
      }
    
    // Play sound with each interval
    playEraseSound()// Update last time
      lastTime = timestamp;
    }
    
    // Continue animation loop
    animationFrame = requestAnimationFrame(animateWithTiming);
  };
  
  // Start animation loop
  animationFrame = requestAnimationFrame(animateWithTiming);
  
  // Store the animation frame ID for cleanup
  soundInterval.value = animationFrame; // Repurpose soundInterval for cleanup
}

const handleMouseUp = () => {
  isMouseDown.value = false
  gsap.to(cursorCircle.value, {
    scale: 1,
    duration: 0.1,
  })
  gsap.to(cursorText.value, {
    innerText: 'subvertir mi existencia',
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
  audio.value.volume = 1 // Set volume to 50%
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

// Define  path index and SVG path array
/* const pathIndex = ref(0)
const svgPaths = [
  'M51.24,199.66c.32-.24,3.91-5.91,7.99-12.57,9.36-15.39,12.91-19.63,17.24-20.56,1.76-.34,4.3-.15,5.71.53,3.76,1.78,8.34,8.22,8.56,11.96.45,4.69,8.03,14.39,11.86,15.1,4.39.79,5.73-1.25,6.72-9.96,1.43-13.08,5.32-16.7,22.36-20.96,12.96-3.15,17.14-5.1,20.65-9.56,2.23-2.85,3.72-3.86,6.92-4.94,11.12-3.75,21.35-1.27,43.95,10.75,12.28,6.46,15.73,7.84,16.92,6.92,2.62-2.01.11-4.62-11.13-11.37-5.82-3.47-11.2-7.03-11.81-7.82-.67-.87-1.72-1.58-2.48-1.75-.7-.09-2.58-1.55-4.2-3.33-2.19-2.35-2.5-3.25-1.6-3.56,1.34-.4-3.68-2.98-8.33-4.44-1.44-.4-2.3-1.51-3.52-4.74-1.59-4.2-1.15-9.71,3.09-35.04,1.21-7.61,1.43-12.58.48-16.77-1.71-7.64-.34-10.46,11.72-23.64,10.23-11.14,12.05-14.68,9.25-18.33-1.28-1.67-2.16-1.99-3.41-1.16-.99.51-3.56,2.1-5.78,3.31-10.29,6.14-23.84,7.22-31.35,2.53-2.98-1.75-4.8-3.62-6.78-7.02-2.45-4.17-3.8-5.28-12.2-10.3-11.98-7.06-16.78-11.82-17.79-17.73l-.71-4.37-6.38,3.51c-16.81,9.14-31.64,9.05-41.84-.13l-2.81-2.51-.96,5.15c-1.13,5.91-2.77,7.55-8.2,8.2-4.84.44-12.21-2.1-28.04-9.73C28.46,2.13,22.57-.28,22.18.03c-1.51,1.16,1.17,7.93,7.66,18.83,3.55,6.1,6.89,12.74,7.47,14.81,2.26,8.35-1.12,16.75-8.53,21.56-4.84,3.22-8.99,1.11-14.73-7.35l-4.17-6.25,1.25,4.09c.71,2.23,2.66,6.91,4.4,10.49,8.3,16.7,5.77,29.49-6.27,32.06-2.57.59-5.71,1.11-6.93,1.16C.4,89.53.07,89.91,0,92.61c0,1.64.44,3.7,1.05,4.49s6.47,3.98,13.06,6.99c8.75,4,12.84,6.53,15.59,9.46,3.44,3.66,3.83,4.5,4.47,11.07,1.08,10.27,2.3,12.35,12.92,22.23,8.84,8.22,9.2,8.69,10.54,13.22,1.27,3.95,1.07,5.99-1.27,12.46-2.58,7.15-6.61,28.16-5.12,27.14Z', // first path
  'M111.68,3.93c-.05,2.28,1.03,8.86,2.45,14.6,1.46,5.65,2.94,12.97,3.45,16.15.94,5.28.83,5.98-1.11,7.6-6.52,5.47-18.57,2.84-30.6-6.56-8.45-6.68-15.57-10.46-17.01-9.11-1.11.92.33,5.21,5.48,17.06,6.82,15.69,6.23,19.79-4.48,30.59-8.75,8.77-11.17,13.06-10.5,18.89.56,5.49-.67,9.29-4.36,13.31-3.87,4.28-9.46,6.58-21.91,8.84C15.23,118.54.97,123.39,0,126.65c-.09.29,2.47.11,5.62-.32,5.2-.65,37.19-.55,43.54.18,5.87.59,10.83,7.8,13.8,19.94,2.34,9.35,4.59,13.36,9.71,17.9,2.83,2.4,6.19,6.21,7.62,8.41,3,4.65,5.03,13.28,4.55,19.5-.17,2.35-.59,8.69-.99,13.89-.89,11.1-.49,13.62,2.1,14.39,5.08,1.51,7.41-.72,13.63-13.27,4.72-9.24,6.24-11.19,10.57-13.14,2.62-1.1,5.69-1.24,11.41-.48,11.83,1.63,22.68,1.61,29.68.14,7.48-1.64,9.31-.79,14.24,6.51,3.76,5.6,6.36,7.41,5.99,4.07-.43-3.47,2.35-13.91,4.52-17.02,1.17-1.84,4.28-4.57,6.88-6.31,2.7-1.7,5.84-4.21,7.28-5.56,4.59-4.58,7.56-4.75,20.02-1.05s12.67,3.34,2.87-2.28c-10.97-6.28-12.19-10.6-4.88-16.26,5-3.84,8.81-5.11,19.49-6.64,4.69-.7,13.1-1.96,18.67-2.81,9.38-1.39,12.87-2.96,11.63-5.11-.17-.47-8.05-3.11-17.32-5.97-21.93-6.6-24.1-8.08-23.94-16.69.05-3.32.05-6.87.08-8.01s-.37-4.39-.88-7.25c-.78-4.4-.65-5.2.79-5.82,2.99-1.3,9.76.49,17.81,4.65,8.24,4.22,15.32,6.73,13.32,4.68-1.11-1.16-26.65-16.35-33.68-20.1-1.74-.83-4.56-2.92-6.19-4.44-2.91-2.84-3.02-3.19-1.65-7.79,1.48-4.99,4.12-8.27,13.82-17.08,4.57-4.17,7.14-7.9,5.7-8.32-.86-.26-6.37,1.45-15.65,4.96-13.81,5.08-17.5,5.56-25.33,3.13-8.79-2.71-24.05-13.18-25.13-17.25-.53-1.72-4.17-2.49-7.51-1.39-16.34,5.17-17.07,5.16-20.64-.38-1.33-1.85-4.97-9.61-8.14-17.22C117.89,7.96,113.97.43,112.53,0c-.38-.11-.7,1.67-.85,3.92Z',     // second path
  'M40.78,69.53c1.51,12.94,2.48,23.56,2.15,23.79-.24.17-10.13-1.61-21.92-3.99C9.36,86.97-.13,85.4,0,85.92s11.32,8.25,24.82,17.16c13.5,8.9,24.74,16.36,24.92,16.6s-1.7,6.38-4.27,13.63c-3.91,11.04-4.72,15.06-3.61,16.6.12.16,2.14-.79,4.51-2.12,8.45-4.69,14.5-3.62,15.68,2.67.92,4.38,5,9.21,14.17,16.54,11.32,9.11,13.59,12.29,13.04,18.22-.48,4.65,1.48,8.78,4.41,9.26.98.16,3.38-.94,5.41-2.4,4.88-3.49,9.66-5.07,13.59-4.56,3.79.48,4.95,2.11,7.11,9.42,1.91,6.62,6.21,13.14,8.77,13.28,1.34.15,3.94-2.57,11.02-11.58,10.5-13.17,16.22-18.74,19.06-18.56,3.26.25,8.64,7.09,14.4,18.23,9.34,18.03,9.85,17.54,6.06-6.31-3.68-23.19-3.9-21.43,4.79-32.82,9.15-11.96,13.56-13.52,22.43-8.18,4.95,2.97,9.23,3.97,9.95,2.22.26-.67-1.56-3.56-4.85-7.47-8.36-10.13-10.69-18.54-9.37-33.88.66-6.99,2.84-10.64,8.44-14.16,2.07-1.23,3.82-2.74,3.91-3.29s1.06-1.62,2.11-2.37c2.68-1.92,1.66-2.66-4.32-2.94-5.03-.33-11.37-2.31-12.59-4.02-2.13-3.15-1.19-4.07,18.28-18.62l19.06-14.26-23.64,5.97c-13.1,3.35-23.9,5.79-24.13,5.46s.14-2.56.87-4.8c1.47-4.99.48-7.23-2.45-5.14-4.96,3.55-3.07-2.23,3.54-10.52,2.16-2.65,4.84-6.29,5.86-8.13,1.08-1.76,2.84-4.62,3.92-6.37s1.33-3.29.69-3.33-7.52,3.41-15.2,7.8c-7.74,4.31-15.55,8.18-17.42,8.65-3.28.75-3.42.72-4.82-2.95-.73-2.06-1.18-8.01-1.05-13.15.22-5.2.11-11.02-.15-12.93-.5-3.45-.56-3.53-2.56-2.72-1.15.45-5.92,4.61-10.57,9.29-14.47,14.66-16.25,13.72-9.32-4.77,7.14-18.89,6.27-19.24-6.79-2.27-4.66,6.04-9.49,11.83-10.67,12.93-3.24,2.69-7.13,1.04-14.7-6.45-6.71-6.63-11.79-9.77-14.19-8.66-.71.38-2.42,5.55-3.72,11.64-1.35,6.01-2.71,11.16-3.03,11.4-.41.29-1.05,1.12-1.6,1.88-.68,1.1-1.3.93-2.47-.7-2.21-3.09-6.92-3.66-9.08-1-1.05,1.12-2.42,2.47-3.07,2.93s-.86,3.44-.59,6.57c.64,5.2.41,5.73-2.52,7.83-4.15,2.97-6.9,2.73-17.88-1.96-5.09-2.13-9.88-3.5-10.73-3.14-1.09.54-.77,6.82,1.27,23.93Z'                 // third path
] */

const erase = (canvas, e) => {

  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left)
  const y = (e.clientY - rect.top)
  const radius = 25
  const randomScale = Math.random() * 0.5 + 0.8

  // Small circle parameters
  const smallRadius = 3 // Make it 40% the size of base circle
  const deviationX = (Math.random() * 300 ) - 150 // Random deviation between -150 and +150
  const deviationY = (Math.random() * 300) - 150 // Random deviation between -150 and +150
  

  ctx.globalCompositeOperation = 'destination-out'
  
  // Draw the base circle
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(randomScale, randomScale)
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2, true)
  ctx.fill()
  ctx.restore()
  // Draw the smaller deviated circle
  if (Math.random() > 0.6){
    ctx.save()
    ctx.translate(x + deviationX, y + deviationY) // Translate to deviated position
    const smallScale = randomScale * 0.6 // Scale proportionally but smaller
    ctx.scale(smallScale, smallScale)
    ctx.beginPath()
    ctx.arc(0, 0, smallRadius, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.restore()
  }
  // ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)


  /* // bullet hole effect
  
  // Save context state
  ctx.save()
  
  // Translate to mouse position
  ctx.translate(x, y)
  
  // Apply random rotation (0-360 degrees)
  const randomRotation = Math.random() * Math.PI * 2
  ctx.rotate(randomRotation)

  // Scale if needed
  const scale = Math.random() * 0.5 // Adjust scale as needed
  ctx.scale(scale, scale)
  
  // Create a new path from the current SVG path data
  const currentPath = svgPaths[pathIndex.value]
  const path = new Path2D(currentPath)

  // Fill the path
  ctx.fill(path)
  
  // Restore context state
  ctx.restore()

  // Move to the next path for the next draw
  pathIndex.value = (pathIndex.value + 1) % svgPaths.length */
  
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
  top: 150px;
  left: 70px;
  width: auto;
  white-space: nowrap;
  font-size: 14px;
  color: white;
  font-weight: bold;
  pointer-events: none;
  user-select: none;
  text-align: left;
}
h1.test{
  font-size: 10vw;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10vw;
  color: #fff;
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
  top: 90px;
  left: 80px;
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
  height: 100vh;
  width: 100vw;
}


</style>