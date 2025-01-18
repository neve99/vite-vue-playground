<script setup>
import { ref, defineProps } from 'vue'
import { gsap } from 'gsap'
const props = defineProps({
  getNextZIndex: Function
})



const count = ref(0)
const cardRef = ref(null)
const zIndex = ref(1)

const trigger = () => {
  gsap.to(cardRef.value,  {duration: 1, top: '50%', left: '50%', x: 0, y: 0, ease: 'elastic.out(1, 0.3)'})
}

const updatezIndex = () => {
  
  zIndex.value = props.getNextZIndex()
  console.log('zIndex', zIndex.value)
}


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