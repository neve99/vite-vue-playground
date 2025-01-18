<script setup>
import { ref, defineProps, watch } from 'vue'
import { gsap } from 'gsap'
const props = defineProps({
  getNextZIndex: Function,
  setActiveCard: Function,
  activeCardId: Object,
  cardId: String
})



const count = ref(0)
const cardRef = ref(null)
const zIndex = ref(1)

// trigger animation

const trigger = () => {
  gsap.to(cardRef.value, { duration: 1, x: '50vw', y: '50vh', ease: 'power1.inOut' })
  props.setActiveCard(props.cardId) // Set this card as the active card
}

// update z-index when card is dragged
const updatezIndex = () => {
  
  zIndex.value = props.getNextZIndex()
  // console.log('zIndex', zIndex.value)
}

// Watch for changes in activeCardId to apply the blur effect
watch(() => props.activeCardId, (newVal) => {
  if (newVal === props.cardId || newVal === null) {
    gsap.to(cardRef.value, { filter: 'none', duration: 0.5,  ease: 'power1.inOut'})
  } else {
    gsap.to(cardRef.value, { filter: 'blur(5px)', duration: 0.1, ease: 'power1.inOut'})
  }
})


</script>


<template>
  <div class="card" v-drag ref="cardRef"  @v-drag-start="updatezIndex" :style="{zIndex: zIndex}">
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