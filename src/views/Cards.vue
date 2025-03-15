<template>
  <div class="project-wrp">
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
let cards = []; // Declare as empty array first
let lastCard = null;
let nextCard = null;
CustomEase.create("cubic", "0.83, 0, 0.17, 1")

let isAnimating = false

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
