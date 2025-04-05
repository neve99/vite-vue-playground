<template>
  <div class="container">
    <div class="text">
      <div class="test"></div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur animi doloremque, temporibus voluptates tempore quaerat earum laboriosam dignissimos deleniti ab harum quibusdam non voluptatibus distinctio quisquam natus beatae perferendis possimus explicabo maxime! Excepturi, neque sint at laudantium ducimus nam? Rem eos at nesciunt. A esse consectetur facere eveniet aliquam. Amet, recusandae odio nulla dolorum accusamus qui sed modi corporis iste nam labore! Fugiat esse vel tempora unde dicta molestiae eligendi totam rem voluptatibus cumque saepe quas debitis distinctio soluta minus a velit assumenda, dolor consequuntur nesciunt? Enim inventore recusandae aut adipisci nam reprehenderit ipsa iste, dolor impedit animi necessitatibus voluptate?
      </p>
    </div>
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
let planet, ring1, ring2, ring3, moon, moonOrbit, stars // define global variable for planet

// Define world axes
const worldYAxis = new THREE.Vector3(0, 1, 0);
const worldXAxis = new THREE.Vector3(1, 0, 0);
const worldZAxis = new THREE.Vector3(0, 0, 1);

// tween camera position
const CAMERA_SMOOTHING = 35.0 // HIGHER VALUE = faster MOVEMENT
let currentX = 0
let currentY = 0
let targetX = 0
let targetY = 0



const initThree = () => {
  // scene
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xf1f1f1);

  // camera
  camera = new THREE.PerspectiveCamera(
    50,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1, // Near clipping plane
    6000 // Far clipping plane
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

  // tween camera position
  const diffX = targetX - currentX
  const diffY = targetY - currentY
  // delta time: seconds per frame
  // The 0.95 value controls the "snap" feeling (lower values = sharper movement)
  const easeFactor = 1.0 - Math.pow(0.95, delta * CAMERA_SMOOTHING)
  
  // apply smoothing 
  currentX += diffX * easeFactor
  currentY += diffY * easeFactor

  // Optional: Add constraints to prevent excessive movement
  const maxDistance = 5000;
  currentX = Math.max(-maxDistance, Math.min(maxDistance, currentX));
  currentY = Math.max(-maxDistance, Math.min(maxDistance, currentY));

  camera.position.x = currentX
  camera.position.y = currentY

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

    stars.rotation.y -= 0.1 * delta; // Rotate stars

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
  // scene.add(mesh);
  return mesh;
}

const makeStars = () => {
  // create array for star positions (x, y, z)
  const particleCount = 2000;
  const particleScatter = 3000
  const positions = new Float32Array(particleCount * 3) // explain

  // create temperary objects to help with the math
  const spherical = new THREE.Spherical()
  const vector = new THREE.Vector3()

  // fill array with random values
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Generate random spherical coordinates
    // Phi: azimuthal angle around y-axis (0 to 2π)
    // Theta: polar angle from y-axis (0 to π)
    spherical.phi = Math.random() * Math.PI * 2
    spherical.theta = Math.random() * Math.PI
    spherical.radius = Math.random() * particleScatter

    // Convert spherical coordinates to Cartesian coordinates
    vector.setFromSpherical(spherical)

    // Assign the x, y, z coordinates to the positions array
    positions[i3] = vector.x
    positions[i3 + 1] = vector.y
    positions[i3 + 2] = vector.z

    /* positions[i3] = (Math.random() - 0.5) * particleScatter
    positions[i3 + 1] = (Math.random() - 0.5) * particleScatter
    positions[i3 + 2] = (Math.random() - 0.5) * particleScatter */
  }

  // create buffer geometry
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // explain

  // create material
  const material = new THREE.PointsMaterial({
    color: 0x00ff00,
    size: 20,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
  })

  // create points
  const points = new THREE.Points(geometry, material)
  scene.add(points)
  return points
}

// handle resize
const onResize = () => {
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight);
}


const onMousemove = (event) => {
  targetX = (window.innerWidth / 2 - event.clientX) * 4;
  targetY = (window.innerHeight / 2 - event.clientY) * 4;
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
  window.removeEventListener('mousemove', onMousemove);
  window.removeEventListener('touchmove', onMousemove);
}

onMounted(() => {
  initThree();

  planet = makePlanet();
  ring1 = makeRing(1200, 0xf1f1f1);
  ring2 = makeRing(1400, 0xf1f1f1);
  ring3 = makeRing(1600, 0xf1f1f1);
  // stars = makeStars();

  // add moon group
  moonOrbit = new THREE.Group();
  scene.add(moonOrbit);
  // add moon to the group
  moon = makeMoon();
  moon.position.set(-1500, 0, 0);
  stars = makeStars();

  moonOrbit.add(moon);


  
  // Start the animation loop
  animate();
  
  // Add event listeners
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMousemove);
  window.addEventListener('touchmove', onMousemove);

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
.text{
  position: relative;
  z-index: 20;
}
.test{
  position: relative;
  width: 20px;
  height: 20px;
  background-color: red;
  z-index: 100;
}
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
  z-index: 0;
}
</style>