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
let scene, camera, renderer, controls, line, clock;
let animationFrameId; // For cleanup
let planet, ring1, ring2, ring3, moon, moonOrbit // define global variable for planet

// Define world axes
const worldYAxis = new THREE.Vector3(0, 1, 0);
const worldXAxis = new THREE.Vector3(1, 0, 0);
const worldZAxis = new THREE.Vector3(0, 0, 1);


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

  // lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1000, 1000, -1000);
  const lightHelper = new THREE.DirectionalLightHelper(light, 50);
  scene.add(light, lightHelper);

  /* const pointLight = new THREE.PointLight(0xff0000, 1, 1000);
  pointLight.position.set(-200, -200, -800);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 50);
  scene.add(pointLight, pointLightHelper); */

  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);

  /* const hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  hemiLight.position.set(0, 1000, 0);
  const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 50 );
  scene.add( hemiLight, hemiLightHelper ); */

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xf1f1f1, 1);

  // Add renderer to the DOM
  threeContainer.value.appendChild(renderer.domElement);

  // Add a clock for delta time
  clock = new THREE.Clock();


}

const animate = () => {
  // Calculate delta time
  const delta = clock.getDelta()
  const elapsedTime = clock.getElapsedTime()

  // Update the camera position
  camera.lookAt(scene.position);
  animationFrameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (planet) {
    // Base rotation
    planet.rotation.y -= 0.2 * delta; // Smoother rotation based on time
    
    // Add slight wobble
    planet.rotation.x = Math.sin(elapsedTime * 0.3) * 1;
    
    // Optional: Add slight position movement
    // planet.position.y = Math.sin(elapsedTime * 0.5) * 30;

    /* ring1.rotation.y -= 0.2 * delta;
    ring2.rotation.x -= 0.2 * delta;
    ring3.rotation.y -= 0.1 * delta;
     */
    ring1.rotateOnWorldAxis(worldYAxis, 0.2 * delta);
    ring2.rotateOnWorldAxis(worldXAxis, - 0.1 * delta);
    // ring1.geometry.rotateY(0.2 * delta);
    ring3.rotation.y -= 0.1 * delta;

    moonOrbit.rotation.y -= 0.2 * delta; 

  }


}

const makePlanet = () => {
  // Create a sphere geometry with a radius of 800 and 128 segments, and put a material
  const geometry = new THREE.SphereGeometry(800, 128, 128)
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/images/matter/somet-1510x307.png');

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.5,
    wireframe: false,
    map: texture,
  }) 
  
  // Create a mesh with the geometry and material, add it to the scene
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)

  return mesh
  

}

const makeRing = (width, color) => {
  const geometry = new THREE.TorusGeometry(width, 5, 16, 100)
  const material = new THREE.MeshStandardMaterial({
    color: color,
    emissive: 0xff0000,
    emissiveIntensity: 0.5,
    transparent: true,
    roughness: 0.5,
    metalness: 0.5,
    wireframe: false,
  })
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2.5;
  // mesh.rotation.y = Math.PI / 10;
  mesh.geometry.rotateY(Math.PI / 10);

  scene.add(mesh)
  return mesh
}

const makeMoon = () => {
  const geometry = new THREE.SphereGeometry(100, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.5,
    wireframe: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

// handle resize
const onResize = () => {
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
}


// Handle cleanup
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

  planet = makePlanet();
  ring1 = makeRing(1200, 0xf1f1f1);
  ring2 = makeRing(1400, 0xf1f1f1);
  ring3 = makeRing(1600, 0xf1f1f1);
  moon = makeMoon();
  moon.position.set(-1500, 0, 0);
  
  moonOrbit = new THREE.Group();
  scene.add(moonOrbit);

  moonOrbit.add(moon);




  
  // Start the animation loop
  animate();
  
  // Add event listeners
  window.addEventListener('resize', onResize);

  // alternative: add scroll event listener
  /* window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    planet.rotation.y = scrollY * 0.002
  }) */
})

onBeforeUnmount(() => {
  cleanup();
});

</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 4000px;
}
.three{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>