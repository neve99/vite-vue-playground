<template>
  <div class="project-wrp">
    <div class="loading-screen" ref="loadingScreen">
      <div class="loading-content">
        <h2>Loading</h2>
        <div class="loading-bar">
          <div class="loading-progress" ref="loadingProgress"></div>
        </div>
      </div>
    </div>
    <nav>
      <div class="logo">
        <a href="#">Noir Wood</a>
      </div>
      <div class="pages">
        <a href="#">Films,</a>
        <a href="#">Production,</a>
        <a href="#">Info,</a>
        <a href="#">Contact</a>
      </div>
      <div class="shop">
        <a href="#">Search</a>
        <a href="#">Account</a>
        <a href="#">Cart</a>
      </div>
    </nav>
    <footer>
      <p>Showreel 2.0</p>
      <p>© 2024 / 2025 Noir Wood</p>
    </footer>
    <div class="container">
      <div class="slider" ref="sliderRef">
        <div class="card">
          <img src="/images/cards/01.jpg" alt="">
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
        <div class="card">
          <img src="/images/cards/07.jpg" alt="">
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
        <div class="card">
          <img src="/images/cards/03.jpg" alt="">
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
        <div class="card">
          <img src="/images/cards/04.jpg" alt="">
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
        <div class="card">
          <img src="/images/cards/06.jpg" alt="">
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'; 
import gsap from 'gsap'
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase)

const sliderRef = ref(null)
const loadingScreen = ref(null);
const loadingProgress = ref(null);
let cards = []; // Declare as empty array first
let lastCard = null;
let nextCard = null;
CustomEase.create("cubic", "0.83, 0, 0.17, 1")

let isAnimating = false

// preload images
const preloadImages = () => {
  return new Promise((resolve) => {
    // Get all images in the document
    const images = document.querySelectorAll('.card img');
    let loadedCount = 0;
    const totalImages = images.length;
    
    // If no images, resolve immediately
    if (totalImages === 0) resolve();
    
    // Function to update progress and check if all images are loaded
    const imageLoaded = () => {
      loadedCount++;
      
      // Calculate the target percentage
      const progressPercent = (loadedCount / totalImages) * 100;
      
      // Animate the progress bar with GSAP instead of direct style manipulation
      if (loadingProgress.value) {
        gsap.to(loadingProgress.value, {
          width: `${progressPercent}%`,
          duration: 0.2,  // Longer duration for smoother animation
          ease: "power2.out"  // Easing function for smooth transitions
        });
      }
      
      // If all images loaded, resolve the promise
      if (loadedCount === totalImages) resolve();
    };
    
    // Add load and error event listeners to each image
    images.forEach(img => {
      // If image is already loaded
      if (img.complete) {
        imageLoaded();
      } else {
        img.addEventListener('load', imageLoaded);
        img.addEventListener('error', imageLoaded); // Still count errors to avoid hanging
      }
    });
  });
};

function splitTextIntoSpans(selector) {
  let elements = document.querySelectorAll(selector)
  elements.forEach(el => {
    let text = el.innerText
    let splitText = text
      .split('')
      .map(function (char){
        return `<span>${char === " " ? "&nbsp;&nbsp" : char}</span>`
      })
      .join('')
    el.innerHTML = splitText;
  })
}

const initializeCards = () => {
  gsap.to(cards,{
    y: (i) => -15 + 15 * i + '%',
    z: (i) => 15 * i,
    duration: 1,
    ease: 'cubic',
    stagger: -0.1
  })
}

onMounted(async() => {
  await nextTick();

  // Wait for images to load
  await preloadImages();

  // Add a slight delay before starting the fade out (looks more natural)
  await new Promise(resolve => setTimeout(resolve, 0));

  // Create a promise that resolves when the animation is complete
  const fadeOutComplete = new Promise(resolve => {
    // Hide loading screen with callback when complete
    gsap.to(loadingScreen.value, {
      y: '-100%',
      duration: 0.8, // Longer fade for smoother transition
      ease: "cubic", // Smoother easing
      onComplete: () => {
        loadingScreen.value.style.display = 'none';
        resolve(); // Resolve the promise when animation is complete
      }
    });
  });

  // Wait for fade out to complete before continuing
  await fadeOutComplete;

  // Initialize cards here after DOM is available
  cards = Array.from(sliderRef.value.children);
  lastCard = cards[cards.length - 1];
  nextCard = cards[cards.length - 2];

  splitTextIntoSpans('.copy h1')
  initializeCards()

  gsap.set('h1 span', { y: -200})
  gsap.set('.slider .card:last-child h1 span', { y: 0})

  document.addEventListener('click', () => {
    if (isAnimating) return
    isAnimating = true

    
  })
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #dfe1c8;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  transition: opacity 0.5s ease, visibility 0.5s;
}

.loading-content {
  text-align: center;
}

.loading-content h2 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #000;
  text-transform: uppercase;

}

.loading-bar {
  width: 200px;
  height: 4px;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.loading-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: #000;
  transition: width 0.3s ease;
}

img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

p,
a{
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  color: #000;
}

nav{
  position: absolute;
  top: 0;
  width: 100%;
  padding: 2em;

  display: flex;
  align-items: center;

  z-index: 2;
}

nav > div{
  flex: 1;
}

.pages{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}

.shop{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1em;
}

footer{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 2em;

  display: flex;
  justify-content: center;
  align-items: center;

  gap: 1em;
  z-index: 2;
}

.container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #dfe1c8;
}

.slider {
  position: absolute;
  top: 15vh;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 200px;
  perspective-origin: 50% 100%;
  display: flex;
}

.card{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;

  transform: translate3d(-50%, -50%, 0);
  background: #000;
}

.card img{
  position: absolute;
  opacity: 0.75;
}

.copy{
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
} 

h1 {
  position: relative;
  text-align: center;
  font-family: 'Times New Roman', Times, serif;
  font-size: 7vw;
  font-weight: 300;
  transform: scaleX(0.75);
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #dfe1c8;
}

h1 span {
  position: relative;
  display: inline-block; 
}

@media (max-width: 900px){
  .pages{
    display: none;
  }
}
</style>
