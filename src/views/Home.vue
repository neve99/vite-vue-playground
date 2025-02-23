<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TheCard from '@/components/TheCard.vue';
import TheSmallPage from '@/components/TheSmallPage.vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap'
const zIndexCounter = ref(1)
const activeCardId = ref(null) // Reactive property to track the active card

const getNextZIndex = () => {
  return ++zIndexCounter.value
}
const setActiveCard = (id) => {
  activeCardId.value = id
}
const handleClickOutside = (event) => {
  if (!event.target.closest('.card')) {
    activeCardId.value = null

  }
}



onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// subpage transition
const beforeEnter = (el) => {
  console.log('before enter')
  gsap.set(el, {
    opacity: 0,
    y: -100 // Start from above the screen
  });
}

const enter = (el, done) => {
  console.log('enter')
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    onComplete: done
    
  });
}

const leave = (el, done) => {
  console.log('leave')
  gsap.to(el, {
    opacity: 0,
    y: 100, // Move down when leaving
    duration: 0.5,
    onComplete: done
  });
}
</script>

<template>

  <div>
    <TheCard :get-next-z-index="getNextZIndex" :set-active-card="setActiveCard" :active-card-id="activeCardId" card-id="1"/>
    <TheCard :get-next-z-index="getNextZIndex" :set-active-card="setActiveCard" :active-card-id="activeCardId" card-id="2"/>
    <TheCard :get-next-z-index="getNextZIndex" :set-active-card="setActiveCard" :active-card-id="activeCardId" card-id="3"/>
    
    <TheSmallPage :active-card-id="activeCardId"/>
    <!-- <TheTestCube /> -->
    <h1>Home</h1>
    <div >
      
      <router-view v-slot="{ Component, route }">
        {{ console.log('Component:', Component) }}
        <transition
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <component :is="Component" :key="route.path" class="child-container"></component>
        </transition>
      </router-view>
      
    </div>  
    <p>Welcome to your new project!</p>

    

  </div>
</template>

<style scoped>
  .child-container {
    position: absolute;
    top: 100px;
    left: 0;
    z-index: 101;
    
  }

</style>