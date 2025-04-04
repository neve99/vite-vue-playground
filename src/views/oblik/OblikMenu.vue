<template>
  <div class="container">
    <header ref="header">
      <img src="/images/oblik/oblik-logo.svg
      " alt="" class="logo">
      <button class="btn__menu" ref="btnMenu" @click="handleMenuClick">
        <img src="/images/oblik/oblik-menu.svg" alt="">
      </button>
      
    </header>
    <div class="home">
      <img src="/images/oblik/oblik-bg.jpg" alt="">
    </div>
    <div class="sections" ref="sections">
      <section class="agentur" ref="agentur">
        <div class="text">Agentur</div>
        <div class="dot"></div>
        <div class="hover__bg"></div>
      </section>
      <section class="neulich" ref="neulich">
        <div class="text">Neulich</div>
        <div class="dot"></div>
        <div class="hover__bg"></div>

      </section>
      <section class="projekte" ref="projekte">
        <div class="text">Projekte</div>
        <div class="dot"></div>
        <div class="hover__bg"></div>

      </section>
    </div>
    
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import gsap from 'gsap'

  const agentur = ref(null)
  const neulich = ref(null)
  const projekte = ref(null)
  // const sections = ref([agentur, neulich, projekte])
  const sections = ref(null)
  const header = ref(null)
  const btnMenu = ref(null)

  const handleMenuClick = () => {
    // const elements = sections.value.map(section => section.value)
    const elements = sections.value.querySelectorAll('section')
    const tl = gsap.timeline()
    tl.to(elements, {
      x: '100vw',
      duration: 1,
      stagger: 0.2,
      ease: 'power2.inOut',
    }, 0).to(header.value, {
      height: '25vh',
      padding: '7vh 32px',
      duration: 1,
      ease: 'power2.inOut',
    }, 0).to(btnMenu.value, {
      x: 200,
      duration: 1,
      ease: 'power2.inOut',
    }, 0)
    /* gsap.to(elements, {
      x: '100vw',
      duration: 1,
      stagger: 0.2,
      ease: 'power2.inOut',
    })

    gsap.to(header.value, {
      height: '25vh',
      padding: '7vh 32px',
      duration: 1,
      ease: 'power2.inOut',
    })

    gsap.to(btnMenu.value, {
      x: 200,
      duration: 1,
      ease: 'power2.inOut',
    }) */
  }

  /* const handleHover = () => {
    gsap.to('.hover__bg', {
      top: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    })
  } */

  
</script>

<style scoped>
  .container {
    font-family: 'TT Firs Neue', sans-serif;
    font-weight: 400;
    width: 100vw;
    overflow: hidden;
    box-sizing: border-box;

    --agentur-color: #ED1345;
    --neulich-color: #9747FF;
    --projekte-color: #00EBA1;
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
    padding: 0;
    
  }

  section {
    position: relative;
    height: 25vh;
    width: 100vw;
    /* background-color: #f3f3f3; */
    background-color: #fff;
    user-select: none;
    border-top: 1px solid #d0d0d0;
    cursor: pointer;
    overflow: hidden;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
  }

  .dot {
    width: 6vh;
    height: 6vh;
    background-color: #000;
    border-radius: 50%;
    transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;
    /* transform: translateY(-50%); */
  }

  .text {
    font-size: 12vh;
    transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;

  }

  .hover__bg {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #545454;
    opacity: 1;
    z-index: -1;
    transition: top 0.3s ease-in-out;
    transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;
  }

  section:hover .hover__bg {
    top: 0;
    /* opacity: 0.5; */
  }
  section:hover .text {
    color: #fff;
  }
  section:hover .dot {
    background-color: #fff;
  }

  .agentur .text {
    color: var(--agentur-color);
  }
  .agentur .dot {
    background-color: var(--agentur-color);
  }
  .agentur .hover__bg {
    background-color: var(--agentur-color);
  }
  
  .neulich .text {
    color: var(--neulich-color);
  }
  .neulich .dot {
    background-color: var(--neulich-color);
  }
  .neulich .hover__bg {
    background-color: var(--neulich-color);
  }
  
  .projekte .text {
    color: var(--projekte-color);
  }
  .projekte .dot {
    background-color: var(--projekte-color);
  }
  .projekte .hover__bg {
    background-color: var(--projekte-color);
  }

  

  .sections{
    position: fixed;
    top: 25vh;
    left: -100vw;
  }
</style>