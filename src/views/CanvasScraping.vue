<template>
  <div class="cursor" ref="cursor">
    <div class="cursor-circle" ref="cursorCircle"></div>
    <span class="cursor-text" ref="cursorText">this is cool</span>
  </div>
  <p class="test">
    Quantum entanglement is the phenomenon of a group of particles being generated, interacting, or sharing spatial proximity in a manner such that the quantum state of each particle of the group cannot be described independently of the state of the others, including when the particles are separated by a large distance. The topic of quantum entanglement is at the heart of the disparity between classical physics and quantum physics: entanglement is a primary feature of quantum mechanics not present in classical mechanics.
  
    Measurements of physical properties such as position, momentum, spin, and polarization performed on entangled particles can, in some cases, be found to be perfectly correlated. For example, if a pair of entangled particles is generated such that their total spin is known to be zero, and one particle is found to have clockwise spin on a first axis, then the spin of the other particle, measured on the same axis, is found to be anticlockwise. However, this behavior gives rise to seemingly paradoxical effects: any measurement of a particle's properties results in an apparent and irreversible wave function collapse of that particle and changes the original quantum state. With entangled particles, such measurements affect the entangled system as a whole.


  </p>

</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { gsap } from 'gsap'

  const cursor = ref(null)
  const cursorText = ref(null)
  const cursorCircle = ref(null)
  let fadeInTrigger = false

  const handleMouseMove = (e) => {
    if (!fadeInTrigger) {
      fadeInTrigger = true
      gsap.to(cursor.value, { opacity: 1, duration: 0.1, delay: 0.1 })
    }
    gsap.to(cursor.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.2,
    })
  }

const handleMouseDown = () => {
    gsap.to(cursorCircle.value, {
      scale: 3.5,
      duration: 0.1,
    })
    gsap.to(cursorText.value, {
      innerText: 'release me plz',
    })
    
  }

const handleMouseUp = () => {
  gsap.to(cursorCircle.value, {
    scale: 1,
    duration: 0.1,
  })
  gsap.to(cursorText.value, {
    innerText: 'this is cool',
  })
  
}

onMounted(() => {
  // Add class to body to hide cursor
  document.body.classList.add('hide-cursor')

  // Initial opacity set to 0
  gsap.set(cursor.value, { opacity: 0 })

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  // Remove class from body to restore cursor
  document.body.classList.remove('hide-cursor')

  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
  .cursor {
    position: fixed;
    pointer-events: none;

    mix-blend-mode: difference;
    top: 0px;
    left: 0px;
    
    transform: translate(-50%, -50%);
  }
  .cursor span {
    position: absolute;
    top: 40px;
    left: 80px;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: white;
    font-weight: bold;
    pointer-events: none;
    user-select: none;
    width: 100px;
    text-align: left;
  }
  .cursor-circle {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    pointer-events: none;
    mix-blend-mode: difference;
    top: 0px;
    left: 0px;
    transform: translate(-50%, -50%);
  }
  .test {
    user-select: none;
  }
  
</style>

<style>
  /* Global style to hide cursor when .hide-cursor class is present on body */
  body.hide-cursor {
    cursor: none;
  }
</style>