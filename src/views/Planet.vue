<template>
  <div class="container">
    <section class="three" ref="threeContainer">

    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

const threeContainer = ref(null);

// three.js variables
let scene, camera, renderer, controls, line;
let animationFrameId; // For cleanup

const initThree = () => {
  // scene
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xf1f1f1);

  // camera
  camera = new THREE.PerspectiveCamera(
    50,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    5000
  );
  camera.position.z = -3000;
  camera.lookAt(scene.position)

  // light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, -1);
  scene.add(light);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 1);

  // Add renderer to the DOM
  threeContainer.value.appendChild(renderer.domElement);



}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
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
  initThree();

  // Add event listeners
  window.addEventListener('resize', onResize);
  // window.addEventListener('mousemove', onMouseMove);
  // window.addEventListener('mousedown', onMouseDown);
  // window.addEventListener('mouseup', onMouseUp);

  // Start the animation loop
  animate();

})

onBeforeUnmount(() => {
  cleanup();
});

</script>

<style scoped>
.three{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>