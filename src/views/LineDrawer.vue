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
let shape


// init three.js
const initThree = () => {
  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f1f1);

  // camera
  camera = new THREE.PerspectiveCamera(
    90,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    5000
  );
  camera.position.z = 50;
  camera.lookAt(scene.position)

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xf1f1f1, 1);

  // Add renderer to the DOM
  threeContainer.value.appendChild(renderer.domElement);
  
  // create shape
  createShape();
  
  // Start rendering
  animate();

  // handle resize
  window.addEventListener('resize', onResize);


}

// MISSING - Animation loop
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  // Rotate the shape if it exists
  /* if (shape) {
    shape.rotation.x += 0.01;
    shape.rotation.y += 0.01;
  } */

  renderer.render(scene, camera);
}

// create shape
const createShape = () => {
  const geometry = new THREE.ConeGeometry(10, 30, 32)
  const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    wireframe: true
  }) 
  shape = new THREE.Mesh(geometry, material)

  // Position it slightly offset from center to ensure it's visible
  shape.position.set(0, 0, 0);
  
  scene.add(shape)
}

// handle resize
const onResize = () => {
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
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

  window.removeEventListener('resize', onResize);
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>