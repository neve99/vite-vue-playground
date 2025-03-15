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
          <img src="/images/cards/02.jpg" alt="">
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
          <img src="/images/cards/05.jpg" alt="">
          <div class="copy">
            <h1>Lorem, ipsum.</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'; 
import gsap from 'gsap'

const sliderRef = ref(null)

onMounted(() => {
  // log the width of the slider
  console.log(sliderRef.value.clientWidth)
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
</style>
