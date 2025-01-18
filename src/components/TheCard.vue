<script setup>
  import { ref, defineProps, watch, computed } from 'vue'
  import { gsap } from 'gsap'
  const props = defineProps({
    getNextZIndex: Function,
    setActiveCard: Function,
    activeCardId: [String, Number],
    cardId: [String, Number]
  })

  const left = computed('calc(50vw - 100px)')
  const top = computed('calc(50vh - 150px)')


  const count = ref(0)
  const cardRef = ref(null)
  const zIndex = ref(1)

  
 
  // trigger animation

  const trigger = () => {
    gsap.to(cardRef.value, { x: 100, duration: 1, ease: 'power1.inOut' })
    props.setActiveCard(props.cardId) // Set this card as the active card

    console.log(cardRef.value)
  }

  // update z-index when card is dragged
  const updatezIndex = () => {
    
    zIndex.value = props.getNextZIndex()
    // console.log('zIndex', zIndex.value)
  }

  // Watch for changes in activeCardId to apply the blur effect
  watch(() => props.activeCardId, (newVal) => {
    if (newVal === props.cardId || newVal === null) {
      gsap.to(cardRef.value, { 
        filter: 'blur(0)', 
        backgroundColor: '#000',
        duration: 0.5, 
        ease: 'power1.inOut' })
      console.log('none')
    } else {
      gsap.to(cardRef.value, { filter: 'blur(5px)', backgroundColor: '#fff', duration: 0.5, ease: 'power1.inOut' })
      console.log('blur')
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

  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
}


</style>