  <template>

  <div class="small-page" ref="smallPageRef">
    
    <h1>this is the small page for card {{ activeDisplay }}</h1>
    <div class="placeholder"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  activeCardId: [String, Number],
})
const activeDisplay = ref(0)
const smallPageRef = ref(null)

watch(() => props.activeCardId, (newVal, oldVal) => {
  if (oldVal == null && newVal !== null) {
    gsap.to(smallPageRef.value, { right: 0, duration: 0.5, ease: 'power1.inOut' })
    activeDisplay.value = newVal

  } else {
    gsap.to(smallPageRef.value, { right: '-39vw', duration: 0.5, ease: 'power1.inOut' })
    activeDisplay.value = oldVal
  }

  
})


</script>

<style scoped>
  .small-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0;

    position: fixed;

    right: -20vw;
    bottom: 0;
    width: 40vw;
    height: 60vh;

    z-index: 100;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
  }
</style>