<template>
<div class="project-wrp">
  <div class="card">
    <img src="/images/cards/01.jpg" alt="">
    <div class="copy">
      <h1 ref="H1">Lorem, ipsum.</h1>
      <h2>
        <span>H</span>
        <span>I</span>
        <span>T</span>
        <span>&nbsp;</span>
        <span>T</span>
        <span>H</span>
        <span>E</span>
        <span>&nbsp;</span>
        <span>R</span>
        <span>O</span>
        <span>A</span>
      </h2>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import CustomEase from "gsap/CustomEase"
gsap.registerPlugin(CustomEase)

CustomEase.create("cubic", "0.83, 0, 0.17, 1")




const  splitTextIntoSpans = (selector) => {
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

onMounted( async() => {
  // Wait for next DOM update
  await nextTick();
  
  // Split text into spans
  splitTextIntoSpans('.copy h1');
  
  // Wait for DOM update after splitting
  await nextTick();
  
  // Now you can animate the spans
  const spans = document.querySelectorAll('h1 span, h2 span')
  
  // Set initial state (off screen)
  gsap.set(spans, { 

    y: 100, 
    opacity: 0, 


    
  })
  
  // Animate spans in with staggered effect
  gsap.to(spans, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.03,
    ease: "cubic"
  })


})
</script>

<style scoped>
.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
  background-color: #000;
  overflow: hidden;
  border-radius: 10px;
}

.card img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.75;
}

.copy {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  color: #fff;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

h1 {
  position: relative;
  text-align: center;
  text-transform: uppercase;
  font-size: 6vw;
  font-family: 'PP Editorial Old', 'Times New Roman', Times, serif;
  font-weight: 300;
}

h2 {
  position: relative;
  text-align: center;
  text-transform: uppercase;
  font-size: 6vw;
  font-family: 'PP Editorial Old', 'Times New Roman', Times, serif;
  font-weight: 300;
}

:deep(h1 span) {
  position: relative;
  display: inline-block; 

}

h2 span {
  position: relative;
  display: inline-block; 
  transform-origin: center bottom;  /* ADD THIS */
  will-change: transform, opacity;  /* ADD THIS */

}
</style>