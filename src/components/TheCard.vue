<script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  import { gsap } from 'gsap'
  const props = defineProps({
    getNextZIndex: Function,
    setActiveCard: Function,
    activeCardId: [String, Number],
    cardId: [String, Number]
  })

  const count = ref(0)
  const cardRef = ref(null)
  const zIndex = ref(1)

  //draggable variables
  const isDragging = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const initialX = ref(0)
  const initialY = ref(0)

  //return position
  const savedPosition = ref({ left: 0, top: 0 })

  // trigger animation
  const trigger = () => {
    savedPosition.value = { 
      left: cardRef.value.offsetLeft, 
      top: cardRef.value.offsetTop 
    }
    gsap.to(cardRef.value, { top:'calc(50vh)', left:'calc(50vw)', duration: 1, ease: 'power1.inOut' })
    props.setActiveCard(props.cardId) // Set this card as the active card
  }

  // update z-index when card is dragged
  const updatezIndex = () => {
    
    zIndex.value = props.getNextZIndex()
    // console.log('zIndex', zIndex.value)
  }

  // Watch for changes in activeCardId to apply the blur effect
  watch(() => props.activeCardId, (newVal, oldVal) => {
    if (newVal === props.cardId || newVal === null) {
      gsap.to(cardRef.value, { 
        filter: 'blur(0)', 
        backgroundColor: '#000',
        duration: 0.5, 
        pointerEvents: 'auto',
        ease: 'power1.inOut' })

    } else {
      gsap.to(cardRef.value, { filter: 'blur(5px)', backgroundColor: '#fff', 
      pointerEvents: 'none',
      duration: 0.5, ease: 'power1.inOut' })

    }

    // If activeCardId is null, return the card to its saved position

    if (newVal === null && oldVal === props.cardId) {
      gsap.to(cardRef.value, { duration: 1, left: savedPosition.value.left, top: savedPosition.value.top, ease: 'power1.inOut' })

    }
  })

  //make card draggable
  const onMouseDown = (event) => {
  isDragging.value = true
  startX.value = event.clientX
  startY.value = event.clientY
  initialX.value = cardRef.value.offsetLeft
  initialY.value = cardRef.value.offsetTop
  updatezIndex()
}

const onMouseMove = (event) => {
  if (isDragging.value) {
    const dx = event.clientX - startX.value
    const dy = event.clientY - startY.value
    cardRef.value.style.left = `${initialX.value + dx}px`
    cardRef.value.style.top = `${initialY.value + dy}px`
  }
}

const onMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

</script>

<template>
  <div class="card"  ref="cardRef"  @mousedown="onMouseDown"  :style="{zIndex: zIndex}">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/TheCard.vue</code> to test HMR
    </p>
    <button type="button" @click="trigger">trigger</button>

  </div>
</template>

<style scoped>
.card {
  width: 200px;
  height: 300px;
  border: 1px solid #42b883;
  border-radius: 0.5em;
  padding: 1em;
  margin: 1em;
  text-align: center;
  background-color: #000;

  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
}


</style>