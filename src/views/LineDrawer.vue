<template>
  <section>
    <!-- three.js goes here -->
    <div ref="threeContainer" class="three-container"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

const threeContainer = ref(null);

// three.js variables
let scene, camera, renderer, controls, line;
let animationFrameId; // For cleanup

// init three.js
const initThree = () => {
  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f1f1);

  // camera
  camera = new THREE.PerspectiveCamera(
    75,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add renderer to the DOM
  threeContainer.value.appendChild(renderer.domElement);
  
  // Start rendering
  animate();
}

// MISSING - Animation loop
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// MISSING - Handle cleanup
const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  if (renderer) {
    renderer.dispose();
    if (threeContainer.value && threeContainer.value.contains(renderer.domElement)) {
      threeContainer.value.removeChild(renderer.domElement);
    }
  }
}

onMounted(() => {
  if (threeContainer.value) {
    initThree();
  }
})

// MISSING - Cleanup on unmount
onBeforeUnmount(() => {
  cleanup();
});
</script>

<style>
.three-container {
  
  width: 100%;
  height: 90vh;
  overflow: hidden;
}
</style>