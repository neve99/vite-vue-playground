<template>
  <div class="scratch-container">
    <div class="coverage-display" ref="coverageDisplay">
      Scratched: 0%
    </div>
    <div class="cursor" ref="cursor">
      <div class="cursor-circle" ref="cursorCircle"></div>
      <img src="/cross100.svg" />
      <span class="cursor-text" ref="cursorText">scratch me</span>
    </div>

    <h1 class="test">Scratch me</h1>
    
    <section class="scratched-in">
      <img src="/images/scraping/7.jpg" alt="" ref="bottomImg">
      <canvas class="in" ref="canvas"></canvas>
    </section>

    <section class="scratched-out">
      <img src="/images/scraping/6.jpg" alt="" ref="topImg">
      <canvas class="out" ref="canvasOut"></canvas>
    </section>
    
    <!-- <p class="test">
      Quantum entanglement is the phenomenon of a group of particles being generated, interacting, or sharing spatial proximity in a manner such that the quantum state of each particle of the group cannot be described independently of the state of the others, including when the particles are separated by a large distance. The topic of quantum entanglement is at the heart of the disparity between classical physics and quantum physics: entanglement is a primary feature of quantum mechanics not present in classical mechanics.
    
      Measurements of physical properties such as position, momentum, spin, and polarization performed on entangled particles can, in some cases, be found to be perfectly correlated. For example, if a pair of entangled particles is generated such that their total spin is known to be zero, and one particle is found to have clockwise spin on a first axis, then the spin of the other particle, measured on the same axis, is found to be anticlockwise. However, this behavior gives rise to seemingly paradoxical effects: any measurement of a particle's properties results in an apparent and irreversible wave function collapse of that particle and changes the original quantum state. With entangled particles, such measurements affect the entangled system as a whole.
    </p> -->
</div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { gsap } from 'gsap'


  const cursor = ref(null)
  const cursorText = ref(null)
  const cursorCircle = ref(null)
  const fadeInTrigger = ref(false)
  const canvas = ref(null)
  const canvasOut = ref(null)
  const isMouseDown = ref(false)
  const isTransitioning = ref(false);
  const bottomImg = ref(null)
  const topImg = ref(null)

  const coverageDisplay = ref(null)
  const throttleTime = 400; // Throttle in ms
  let lastUpdateTime = 0;

  let currentImageIndex = 0
  const totalImgNum = 7


  // cycle through images
  const cycleImage = (imgRef) => {
    // safty
    // if(!imgRef.value || imgRef) return null

    // get next image number
    const currentSrc = imgRef.value.src
    let nextImgNum = parseInt(currentSrc.split('/').pop().split('.')[0]) + 1

    if (nextImgNum > totalImgNum) {
      nextImgNum = 1
    }

    const nextImgUrl = `/images/scraping/${nextImgNum}.jpg`
    return nextImgUrl
  }


  // handle coverage threshold
  const handleThreshold = async () => {
    // Create white overlay for transition
    const whiteOverlay = document.createElement('div');
    whiteOverlay.style.display = 'none';
    whiteOverlay.style.position = 'fixed';
    whiteOverlay.style.top = '0';
    whiteOverlay.style.left = '0';
    whiteOverlay.style.width = '100vw';
    whiteOverlay.style.height = '100vh';
    whiteOverlay.style.backgroundColor = 'white';
    whiteOverlay.style.zIndex = '9999';
    whiteOverlay.style.opacity = '0';
    whiteOverlay.style.transition = 'opacity 100ms ease-in-out';
    whiteOverlay.style.pointerEvents = 'none';
    
    document.body.appendChild(whiteOverlay);
    
    // Fade in white overlay
    setTimeout(() => {
      whiteOverlay.style.opacity = '1';
    }, 10);
    
    // Wait for fade-in to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Calculate next image number
    const nextTopImgUrl = cycleImage(topImg)
    const nextBottomImgUrl = cycleImage(bottomImg)
    console.log('nextTomImg', nextTopImgUrl)
    console.log('Butt', nextBottomImgUrl)
    
    // Update the images
    topImg.value.src = nextTopImgUrl
    if(nextBottomImgUrl) bottomImg.value.src = nextBottomImgUrl
    
    
    // Reset both canvases
    setupCanvas(canvas.value);
    setupCanvas(canvasOut.value);
    
    // Reset coverage display
    if (coverageDisplay.value) {
      coverageDisplay.value.textContent = 'Scratched: 0%';
    }
    
    // Wait a bit with white screen
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Fade out white overlay
    whiteOverlay.style.opacity = '0';
    
    // Clean up after animation
    setTimeout(() => {
      document.body.removeChild(whiteOverlay);
    }, 100);
    
    return Promise.resolve();
  }

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

    moveDraw(canvas.value, e)
    moveDraw(canvasOut.value, e)

  }

  const handleMouseDown = (e) => {
    isMouseDown.value = true
    startDraw(canvas.value, e)
    startDraw(canvasOut.value, e)
    gsap.to(cursorCircle.value, {
      scale: 5.5,
      duration: 0.1,
    })
    gsap.to(cursorText.value, {
      innerText: 'to nothingness',
    })
      
  }

  const handleMouseUp = () => {
    isMouseDown.value = false
    gsap.to(cursorCircle.value, {
      scale: 1,
      duration: 0.1,
    })
    gsap.to(cursorText.value, {
      innerText: 'reduce me',
    })
    
  }

  const handleTouchStart = (e) => {
    e.preventDefault()

    // convert touch to mouse event
    const touch = e.touches[0]

    isMouseDown.value = true
    startDraw(canvas.value, touch)
    startDraw(canvasOut.value, touch)

    // update cursor
    if (cursor.value) {
      gsap.to(cursorCircle.value, {
        x: touch.clientX,
        y: touch.clientY,
        duration: 0.2,
      })
      gsap.to(cursorCircle.value, {
        scale:5.5,
        duration: 0.1,
      })
      gsap.to(cursorText.value, {
        innerText: 'to nothingness',
      })
    }
  }
  const handleTouchMove = (e) => {
    e.preventDefault()

    // convert touch to mouse event
    const touch = e.touches[0]

    moveDraw(canvas.value, touch)
    moveDraw(canvasOut.value, touch)

    // update cursor
    if (cursor.value) {
      gsap.to(cursor.value, {
        x: touch.clientX,
        y: touch.clientY,
        duration: 0.2,
      })
    }
  }
  const handleTouchEnd = (e) => {
    e.preventDefault()

    isMouseDown.value = false

    // update cursor
    if (cursorCircle.value && cursorText.value) {
      gsap.to(cursorCircle.value, {
        scale: 1,
        duration: 0.1,
      })
      gsap.to(cursorText.value, {
        innerText: 'reduce me',
      })
    }
  }

  // Setup canvas /////////////////////////////////////////////////
  const setupCanvas = (canvas) => {
    /* 
    // generated code to cover the whole screen
    const canvas = canvas.value
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height) 
    */
    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = window.devicePixelRatio

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'

    const ctx = canvas.getContext('2d')

    ctx.scale(dpr, dpr)

    /* if (canvas.classList.contains('in')) {
      ctx.globalCompositeOperation = 'source-over'
    } else {
      ctx.globalCompositeOperation = 'destination-out'
    } */

    if (canvas.classList.contains('in')) {
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#000'
    } else {
      ctx.fillStyle = '#000'
      ctx.strokeStyle = '#fff'
    }

    ctx.fillRect(0, 0, w, h) 

    ctx.lineWidth = 80
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.shadowBlur = 25
    ctx.shadowColor = ctx.strokeStyle
    
  }
  const startDraw = (canvas, e) => {
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) 
    const y = (e.clientY - rect.top) 

    // const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange']
    // const randomColor = colors[Math.floor(Math.random() * colors.length)]
    // ctx.strokeStyle = randomColor
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  const moveDraw = (canvas, e) => {
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) 
    const y = (e.clientY - rect.top) 
    
    // pixel rectangle draw
    // ctx.fillRect(x - 50, y - 50, 100, 100)
    if (isMouseDown.value) {
      ctx.lineTo(x, y)
      ctx.stroke()
      // Throttle coverage calculation to avoid performance issues
      const now = Date.now();
      if (now - lastUpdateTime > throttleTime) {
        lastUpdateTime = now;
        const coverage = calculateCoverage(canvas);
        
        if (coverageDisplay.value) {
          coverageDisplay.value.textContent = `Scratched: ${coverage.percentScratched}%`;
        }
        
        // Optional: Trigger an event when scratch reaches a certain percentage
        if (coverage.percentScratched > 50) {
          // console.log('More than 50% scratched!');
          // Do something special here
        }

        // Add threshold detection 99%
        if (parseFloat(coverage.percentScratched) >= 99 && !isTransitioning.value) {
          isTransitioning.value = true;
          
          // Trigger the image swap with animation
          handleThreshold().then(() => {
            setTimeout(() => {
              isTransitioning.value = false;
            }, 500); // Prevent multiple triggers
          });
        }
      }
    }
  }

  const handleResize = () => {
    setupCanvas(canvas.value)
    setupCanvas(canvasOut.value)
  } 

  const calculateCoverage = (canvas) => {
    // Create a downsampled version for analysis
    const offscreenCanvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Use a smaller size for analysis (e.g., 100×100 pixels)
    /* const scaleFactor = Math.max(canvas.width, canvas.height) / 100;
    const offW = Math.floor(canvas.width / scaleFactor);
    const offH = Math.floor(canvas.height / scaleFactor); */

    // Use a much smaller size for analysis (25x25 pixels is sufficient)
    const offW = 10;
    const offH = 10;
    
    offscreenCanvas.width = offW;
    offscreenCanvas.height = offH;
    
    // Draw the main canvas onto the smaller one
    const offCtx = offscreenCanvas.getContext('2d');
    offCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, offW, offH);
    
    // Analyze the smaller canvas (many fewer pixels)
    const imageData = offCtx.getImageData(0, 0, offW, offH);
    const data = imageData.data;
    
    let totalPixels = data.length / 4;
    let scratchedPixels = 0;
    
    if (canvas.classList.contains('in')) {
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] < 20 && data[i+1] < 20 && data[i+2] < 20) {
          scratchedPixels++;
        }
      }
    } else {
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 230 && data[i+1] > 230 && data[i+2] > 230) {
          scratchedPixels++;
        }
      }
    }
    
    const percentScratched = (scratchedPixels / totalPixels) * 100;
    
    return {
      percentScratched: percentScratched.toFixed(0),
      scratchedPixels,
      totalPixels
    };
  };

  onMounted(() => {
    
    // Preload images
    for (let i = 1; i <= 7; i++) {
      const img = new Image();
      img.src = `/images/scraping/${i}.jpg`;
    }
    // Add class to body to hide cursor
    document.body.classList.add('hide-cursor-1')

    // Initial opacity set to 0
    gsap.set(cursor.value, { opacity: 0 })

    setupCanvas(canvas.value)
    setupCanvas(canvasOut.value)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    // Remove class from body to restore cursor
    document.body.classList.remove('hide-cursor-1')

    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)

    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)

    window.removeEventListener('resize', handleResize)
  })
</script>

<style scoped>
  .scratch-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    touch-action: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .coverage-display{
    position: fixed;
    top: 10px;
    pointer-events: none;
    left: 50%;
    transform: translateX(-50%);
    color: black;
    z-index: 100;
  }
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

    /* padding: 10px, 10px; */
    /* transform: translate(-50%, -50%); */
    font-size: 14px;
    color: white;
    font-weight: bold;
    pointer-events: none;
    user-select: none;
    text-align: left;
    /* border: 1px solid white; */
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
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    mix-blend-mode: lighten;
  }
  
  section.scratched-out, section.scratched-in {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    mix-blend-mode: darken;
  }

  
  section.scratched-out img, section.scratched-in img {
    
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
</style>

<style>
  /* Global style to hide cursor when .hide-cursor class is present on body */
  body.hide-cursor-1 {
    cursor: none;
;   background-color: white;
  }

</style>