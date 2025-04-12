<template>
<div class="scroll-pin-container">
  <nav>
    <div class="logo">
      <a href="#">somet.zip</a>
    </div>
    <div class="links">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Videos</a>
      <a href="#">Contact</a>
    </div>
  </nav>

  <section class="hero">
    <h1>Somet.zip</h1>

    <div class="hero-copy">
      <p>Look at us, we are looking at a website</p>
      <p>(Scroll)</p>
    </div>
  </section>

  <section class="intro">
    <div class="video-container-desktop" ref="videoContainerRef">
      <div class="video-preview">
        <div class="video-wrapper">
          <iframe 
            src="https://player.vimeo.com/video/1057631119?h=4dbcf6c8ee&autoplay=1&loop=1&background=1&muted=1&controls=0&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"  
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            muted
            referrerpolicy="no-referrer"
            loading="lazy"
            title="tuningfork_xyz"
            credentialless
          ></iframe>
        </div>
      </div>
      <div class="video-title">
        <p>Somet.zip video</p>
        <p>2023 - 2025</p>
      </div>
    </div>
  </section>

  <section class="outro">
    <p>This is a very good sign.</p>
  </section>
</div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const videoContainerRef = ref(null);

const cleanUp = () => {
  // remove the event listener when the component is destroyed
  window.removeEventListener('mousemove', () => {})
  window.removeEventListener('resize', () => {})

  // Cancel animation frame
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Kill all ScrollTrigger instances
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Kill Lenis
  if (window.lenis) {
    window.lenis.destroy();
  }

}

onMounted(() => {
  // select some elements
  const videoTitleElements = document.querySelectorAll('.video-title p')
  const videoContainer = videoContainerRef.value

  
  if (window.innerWidth >= 900) {
    //setup a lenis and integrate with gsap scrollTrigger, pretty standard
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // adjust the starting vertical position and movement sensitivity according to different screen sizes dynamically
    // smaller screens starts the video container higher and use a smaller movement multiplier
    const breakpoint = [
      { maxWidth:1000, translateY: -135, movMultiplier: 450},
      { maxWidth:1100, translateY: -130, movMultiplier: 500},
      { maxWidth:1200, translateY: -125, movMultiplier: 550},
      { maxWidth:1300, translateY: -120, movMultiplier: 600},
    ]

    // use a function that checks the current screen width and loop through each breaking point, returns the appropriate values
    // if the screen is smaller than the last breakpoint, return the translateY and movMultiplier values
    // these values determine how far up the video container starts and how sensitive the movement is when moving the mouse horizontally
    const getInitialValues = () => {
      const width = window.innerWidth

      for (const bp of breakpoint) {
        if (width <= bp.maxWidth) {
          return {
            translateY: bp.translateY,
            movementMultiplier: bp.movMultiplier
          }
        }
      }

      // if the screen is larger than all of the breakpoint, return these values
      return {
        translateY: -110,
        movementMultiplier: 650,
      }
    }

    const initialValues = getInitialValues()
    // console.log('Initial values movementMultiplier:', initialValues.movementMultiplier);
    // set up an object to manage the entire animation state, keeping track of everything that is changing during the animation
    const animationState = {
      scrollProgress: 0,
      initialTranslateY : initialValues.translateY,
      currentTranslateY : initialValues.translateY,
      movementMultiplier : initialValues.movementMultiplier,
      scale: 0.25,
      fontSize: 80,
      gap: 2,
      targetMouseX: 0,
      currentMouseX: 0,
    }
    // initialization animationState works
    // console.log('Initial animationState:', JSON.stringify(animationState));
    // console.log('Initial animationState currentMouseX:', animationState.currentMouseX);
    // make the animation responsive
    window.addEventListener('resize', () => {
      const newValues = getInitialValues()
      animationState.initialTranslateY = newValues.translateY
      animationState.movementMultiplier = newValues.movementMultiplier

      if (animationState.scrollProgress === 0) {
        animationState.currentTranslateY = newValues.translateY
      }
    })

    gsap.timeline ({
      scrollTrigger: {
        trigger:'.intro',
        start:'top bottom',
        end: 'top 10%',
        // meaning the animation progress is directly tied to the scroll progress
        scrub: true,
        onUpdate: (self) => {
          // scroll progress works
          //console.log("ScrollTrigger progress:", self.progress);
          animationState.scrollProgress = self.progress
          // this works too
          // console.log("Before update - Current scale:", animationState.scale);

          animationState.currentTranslateY = gsap.utils.interpolate(
            animationState.initialTranslateY,
            0,
            animationState.scrollProgress
          )

          animationState.scale = gsap.utils.interpolate(
            0.25,
            1,
            animationState.scrollProgress
          )

          animationState.gap = gsap.utils.interpolate(
            2,
            1,
            animationState.scrollProgress
          )

          // font size animation with 2 phases
          // first 40% of the scroll progress, the font size shrink from 80px to 40px
          if (animationState.scrollProgress <= 0.4) {
            const firstPartProgress = animationState.scrollProgress / 0.4
            animationState.fontSize = gsap.utils.interpolate(
              80,
              40,
              firstPartProgress
            )
          }else {
            // after 40% of the scroll progress, the font size shrink from 40px to 20px
            // the shrinking is slower in this phase
            // by spliting the animation into 2 phases, we can create an illusion that the font size is not really changing and is staying static
            const secondPartProgress = (animationState.scrollProgress - 0.4) / (1 - 0.4)
            animationState.fontSize = gsap.utils.interpolate(
              40,
              20 ,
              secondPartProgress
            )
          }

        }
      }
    })

    document.addEventListener('mousemove', (e) => {
      // calculate the mouse position relative to the screen width
      // and map it to a range of -1 to 1
      animationState.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
    })

    const animate = () => {
      // don't want the animation to run on mobile
      if (window.innerWidth < 900) {
        return
      }
      // console.log('in animate: animationState.currentMouseX type:', typeof animationState.currentMouseX, 'value:', animationState.currentMouseX);

      const {
        scale,
        targetMouseX,
        currentTranslateY,
        movementMultiplier,
        currentMouseX,
        gap,
        fontSize,
      } = animationState


      // console.log('currentMouseX type:', typeof currentMouseX, 'value:', currentMouseX);
      // console.log('animationState.currentMouseX type:', typeof animationState.currentMouseX, 'value:', animationState.currentMouseX);


      // Log animation state values -- also works
      // console.log("Animation frame - scale:", scale, "translateY:", currentTranslateY);
  
      // Log the actual transform being applied -- also works
      // console.log("Transform string:", `translateY(${currentTranslateY}%) scale(${scale}) translateX(${animationState.currentMouseX}px)`);
  

      // calculate how much horizontal movement to apply based on the current scale of the container
      // the smaller the container, the more responsive it is to mouse movement
      const scaleMovementMultiplier = (1 - scale) * movementMultiplier
      // console.log('movementMultiplier:', movementMultiplier);
      // gradually weaken that effect, and check if the scale is smaller that 0.95, if it is, we calculate how far the container should move left or right
      // if the scale is larger than 0.95, we don't want to move the container at all
      const maxHorizontalMovement = scale < 0.95 ? targetMouseX * scaleMovementMultiplier : 0
      // console.log('maxHorizontalMovement:', maxHorizontalMovement);
      // console.log('targetMouseX:', targetMouseX);
      // console.log('scaleMovementMultiplier:', scaleMovementMultiplier);

      // create a delay effect to smooth out the movement
      animationState.currentMouseX = gsap.utils.interpolate(
        currentMouseX,
        maxHorizontalMovement,
        0.05
      )
      
      // console.log('animationState.currentMouseX:', animationState.currentMouseX);
      
      // set the position and scale of the video container
      videoContainer.style.willChange = 'transform'
      // videoContainer.style.transform = `scale(${scale}) translateY(${currentTranslateY}%) translateX(${animationState.currentMouseX}px)`
      videoContainer.style.transform = `
        translateY(${currentTranslateY}%) 
        translateX(${animationState.currentMouseX}px)
        scale(${scale})`
      // videoContainer.style.transform = `translateX(${animationState.currentMouseX}px`
      // console.log(animationState.currentMouseX)


      videoContainerRef.value.style.gap = `${gap}em`

      videoTitleElements.forEach((el) => {
        el.style.fontSize = `${fontSize}px`
      })

      // keep teh animation loop going
      requestAnimationFrame(animate)
    }

    // see above
    animate()

    
  }

})

onUnmounted(() => {
  cleanUp()
})
</script>

<style scoped>
.scroll-pin-container {
  font-family: 'PP Neue Montreal', 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #1a1a1a;
  background-color: #e3e3db;
  overflow-x: hidden;
}

h1 {
  font-size: 60px;
  font-weight: 500;
}

p {
  font-size: 20px;
  font-weight: 500;
}

a {
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  padding: 2em 2.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  mix-blend-mode: difference;
  z-index: 2;
}

.links {
  display: flex;
  gap: 1em;
}

section {
  width: 100vw;
  height: 100svh;
  padding: 2.5em;
}

.hero {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 4em;
}

.hero h1 {
  position: relative;
  left: -0.05em;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 20.55vw;
  letter-spacing: -0.04em;
  line-height: 1;
}

.hero-copy {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.outro {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.intro{
  height: 100%;
}

.video-container-desktop {
  position: relative;
  transform: translateY(-105%) scale(0.25);
  display: flex;
  flex-direction: column;
  gap: 2em;
  will-change: transform;
}

.video-container-desktop .video-title p {
  position: relative;
  font-size: 78px;
  font-weight: 500;
}

.video-container-mobile {
  display: none;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.video-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 1.5rem;
  background-color: #b9b9b3;
  overflow: hidden;
}

.video-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  pointer-events: none;
}

@media screen and (max-width: 768px) {
  nav,
  section {
    padding: 1.5em;
  }

  .hero {
    justify-content: flex-end;
    gap: 2em;;
  }

  .hero h1 {
    font-size: 19vw;
  }
  
  .video-container-desktop {
    display: none;
  }

  .video-container-mobile {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
}
</style>