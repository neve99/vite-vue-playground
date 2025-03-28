<template>
  <div class="container">
    <header>
      <img src="/images/oblik/oblik-logo.svg
      " alt="" class="logo">
      <button class="btn__menu">
        <img src="/images/oblik/oblik-menu.svg" alt="">
      </button>
      
    </header>
    <div class="home">
      <img src="/images/oblik/oblik-bg.jpg" alt="">
    </div>
    <div class="sections">
      <section class="agentur">
      <div class="dot"></div>
      <div class="text">Agentur</div>
    </section>
    <section class="neulich">
      <div class="dot"></div>
      <div class="text">Neulich</div>
    </section>
    <section class="projekte">
      <div class="dot"></div>
      <div class="text">Projekte</div>
    </section>
    </div>
    
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import gsap from 'gsap'

  

  
</script>

<style scoped>
  .container {
    font-family: 'TT Firs Neue', sans-serif;
    font-weight: normal;
    width: 100vw;
    overflow: hidden;
  }

  .home {
    width: 100%;
  }
  .home img {
    width: 100%;
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
  }

  header {
    height: 113px;
    width: 100%;
    padding: 24px 32px;

    position: fixed;
    background-color: #fff;

    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  header .logo {
    height: 100%;
  }

  button.btn__menu {
    position: absolute;
    right: 32px;
    top: 32px;
  }

  section {
    position: relative;
    height: 25vh;
    width: 100vw;
    background-color: #f3f3f3;
    user-select: none;
    border-top: 1px solid #d0d0d0;
  }

  .dot {
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #000;
    border-radius: 50%;
    left: 135px;
    top: 50%;
    /* transform: translateY(-50%); */
  }

  .text {
    position: absolute;
    right: 180px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12vh;
    font-weight: regular;
    color: #000;
  }

  .sections{
    position: fixed;
    top: 25vh;
    left: -100vw;
  }
</style>