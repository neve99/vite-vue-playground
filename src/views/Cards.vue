<template>
  <div class="project-wrp">
    <div class="loading-indicator" ref="loadingIndicator">Loading...</div>
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
          <div class="img-ctn">
            <img src="/images/cards/01.jpg" alt="">
          </div>
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
        <div class="card">
          <div class="img-ctn">
            <img src="/images/cards/07.jpg" alt="">
          </div>
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
        <div class="card">
          <div class="img-ctn">
            <img src="/images/cards/03.jpg" alt="">
          </div>
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
        <div class="card">
          <div class="img-ctn">
            <img src="/images/cards/04.jpg" alt="">
          </div>
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
        <div class="card">
          <div class="img-ctn">
            <img src="/images/cards/06.jpg" alt="">
          </div>
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, onUnmounted } from 'vue'; 
import gsap from 'gsap'
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase)

const sliderRef = ref(null)
const loadingIndicator = ref(null);
const mouseX = ref(0);
const mouseY = ref(0);
let cards = []; // Declare as empty array first
let lastCard = null;
let nextCard = null;
let activeCard = null;
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
        img.addEventListener('error', imageLoaded);
      }
    });
  });
};

const splitTextIntoSpans = (selector) => {
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
  // Initialize cards here after DOM is available
  cards = Array.from(sliderRef.value.children); 

  // Set initial position of cards, each cards will be pushed upwards by 15% and z position will be increased by 15 depending on their index
  gsap.to(cards,{
    y: (i) => -15 + 15 * i + '%',
    z: (i) => 15 * i,
    duration: 1,
    ease: 'cubic',
    stagger: -0.1,
  })

  // get the active card
  activeCard = cards[cards.length - 1];
  activeCard.addEventListener('mousemove', handleMouseMove)
}

const handleMouseMove = (e) => {
  

  // calculate mouse position
  mouseX.value = (e.clientX / window.innerWidth) - 0.5
  mouseY.value = (e.clientY / window.innerHeight) - 0.5

  // apply the parallax effect to the nextCard
  const paraImg = activeCard.querySelector('img')
  gsap.to(paraImg, {
    x: mouseX.value * 15,
    y: mouseY.value * 15,
    duration: 0.5,
  })
}

onMounted(async() => {
  await nextTick();

  // Wait for images to load
  await preloadImages();

  // Fade out loading indicator when complete
  gsap.to(loadingIndicator.value, {
    opacity: 0,
    duration: 0.8,
    onComplete: () => {
      setTimeout(() => {
        loadingIndicator.value.style.display = 'none';
      }, 500);
    }
  });

  splitTextIntoSpans('.copy h1')

  await nextTick();

  setTimeout(() => {
    initializeCards()

  }, 800)
  
  // push all h1 span upwards offscreen except for the last card
  gsap.set('h1 span', { y: -200})
  gsap.set('.slider .card:last-child h1 span', { y: 0})


  document.addEventListener('click', () => {

    // console.log('click')

    if (isAnimating) return
    isAnimating = true

    const slider = sliderRef.value;

    // remove last card from array and store it, then get the next card
    lastCard = cards.pop();
    nextCard = cards[cards.length - 1];


    
    // control the lastcard text sliding down and changing color
    const lastcardSpans = lastCard.querySelectorAll('h1 span')
    gsap.to(lastcardSpans, {
      color: 'red',
      y: 200,
      duration: 0.75,
      ease: 'cubic',
    })

    // slide lastcard itself down
    gsap.to(lastCard, {
      y: '+=150%',
      duration: 0.75,
      ease: 'cubic',
      onComplete: () => {
        // remove last card from DOM and add it to the beginning
        slider.prepend(lastCard)

        // reinitialize cards, make its text upwards offscreen and set isAnimating to false
        initializeCards()
        gsap.set(lastCard.querySelectorAll('h1 span'), { y: -200, color: '#dfe1c8',})

        setTimeout(() => {
          isAnimating = false
        },1000)
      }
    })

    // make the next card text slide down with staggered effect
    gsap.to(nextCard.querySelectorAll('h1 span'), {
      y: 0,
      duration: 1,
      ease: 'cubic',
      stagger: 0.05,
    })
    
  })
})

onUnmounted(() => {
  window.removeEventListener('click', () => {})
  activeCard.removeEventListener('mousemove', handleMouseMove)


})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.loading-indicator {
  position: fixed;
  bottom: 0px;
  left: 0px;

  color: #000;
  padding: 2em;
  font-size: 14px;
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.5s ease;
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

footer p{
  color: #dfe1c8;

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

.img-ctn{
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.card img{
  position: absolute;
  opacity: 0.75;
  user-select: none;
  transform: scale(1.5);
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
  font-family: 'PP Editorial Old', 'Times New Roman', Times, serif;
  font-size: 6vw;
  font-weight: 300;
  /* transform: scaleX(0.75); */
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: #dfe1c8;
}

:deep(h1 span) {
  position: relative;
  display: inline-block; 
  user-select: none;
}

@media (max-width: 900px){
  .pages{
    display: none;
  }
}
</style>
