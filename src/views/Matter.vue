<template>
  <div class="matter-page">

    <!-- <div class="controls">
      <button @click="addCircle">Add Circle</button>
      <button @click="addRectangle">Add Rectangle</button>
      <button @click="resetWorld">Reset</button>
    </div> -->
    <div class="somet-pic">
      <img src="/images/matter/somet-1510x307.png" alt="">
    </div>
    <div id="matter-container" ref="matterContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Matter from 'matter-js';

// Create refs for the physics world
const matterContainer = ref(null);
let engine = null;
let render = null;
let runner = null;
let world = null;

// Module aliases (const Engine = Matter.Engine, etc.)
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Events, Composites } = Matter;
const w = window.innerWidth;
const h = window.innerHeight;

// get responsive scale based on window size
const getResponsiveScale = () => {
  const baseScale = 0.6;
  const referenceWidth = 1920;
  const scaleFactor = Math.min(window.innerWidth / referenceWidth, 1);
  return Math.max(0.25, Math.min(baseScale * scaleFactor, 0.6));
}

const scale = ref(getResponsiveScale());
// Initialize physics simulation
onMounted(() => {
  // Create engine
  engine = Engine.create();
  world = engine.world;
  
  // Create renderer
  render = Render.create({
    element: matterContainer.value,
    engine: engine,
    options: {
      width: w,
      height: h,
      wireframes: false,
      // background: '#f4f4f8'
      background: 'transparent',
      pixelRatio: window.devicePixelRatio,
    }
  });
  
  // Create boundaries
  const wallThickness = 50;
  const width = render.options.width;
  const height = render.options.height;
  
  const extraHeight = 2000;
  // Create walls
  const ground = Bodies.rectangle(width/2, height + wallThickness/2, width + wallThickness, wallThickness, { 
    isStatic: true,
    render: { fillStyle: '#2e2b44', visible: false } 
  });
  const ceiling = Bodies.rectangle(width/2, -wallThickness/2 - extraHeight, width + wallThickness, wallThickness, { 
    isStatic: true,
    render: { fillStyle: '#2e2b44', visible: false } 
  });
  const leftWall = Bodies.rectangle(-wallThickness/2, (height - extraHeight)/2, wallThickness, height + extraHeight, { 
    isStatic: true,
    render: { fillStyle: '#2e2b44',  visible: false} 
  });
  const rightWall = Bodies.rectangle(width + wallThickness/2, (height - extraHeight)/2, wallThickness, height + extraHeight, { 
    isStatic: true,

    render: { fillStyle: '#2e2b44', visible: false,} 
  });
  
  // Add initial bodies
  /* const circle1 = Bodies.circle(20 + w/2, 50, 30, {
    restitution: 0.8,
    render: { fillStyle: '#ff6b6b' }
  });
  
  const rect1 = Bodies.rectangle(w/2 + 100, 200, 60, 60, {
    render: { fillStyle: '#48dbfb' }
  });
  
  const poly1 = Bodies.polygon(w/2 - 100, 100, 12, 40, {
    render: { fillStyle: '#1dd1a1' }
  });

  const bigBall = Bodies.circle(w/2, h/2, 300, {
    isStatic: true,
    render: { fillStyle: '#ff6b6b' }
  });

  const initialShape = Composites.stack(50, 50, 5, 1, 400, 400, (x, y) => {
    createShape(x, y);
  }); */


  const battery = Bodies.rectangle(w/2, -400, 575 * scale.value, 1555 * scale.value, {
    restitution: 0.7,
    angle: Math.PI / 24,
    render: { 
      // fillStyle: getRandomColor() 

      sprite: {
        texture: '/images/matter/battery-547x1555.png',
        xScale: scale.value,
        yScale: scale.value
      }
    }
  });
  const harddrive1 = Bodies.rectangle(w/2, -400, 639 * scale.value, 891 * scale.value, {
    restitution: 0.7,
    angle: - Math.PI / 24,
    render: { 
      // fillStyle: getRandomColor(),
      sprite: {
        texture: '/images/matter/harddrive-blue-639x891.png',
        xScale: scale.value,
        yScale: scale.value
      }
    }
  });
  const harddrive2 = Bodies.rectangle(w/2 - 100, -400, 639 * scale.value, 891 * scale.value, {
    restitution: 0.7,
    angle:  Math.PI / 24,
    render: { 
      // fillStyle: getRandomColor(),
      sprite: {
        texture: '/images/matter/harddrive-white-639x891.png',
        xScale: scale.value,
        yScale: scale.value
      }
    }
  });
  const print1 = Bodies.rectangle(w/2, -400, 895 * scale.value, 747 * scale.value, {
    restitution: 0.7,
    angle:  Math.PI / 24,
    render: { 
      // fillStyle: getRandomColor(),
      sprite: {
        texture: '/images/matter/print-blue-895x747.png',
        xScale: scale.value,
        yScale: scale.value
      }
    }
  });
  const print2 = Bodies.rectangle(w/2 + 50, -400, 895 * scale.value, 747 * scale.value, {
    restitution: 0.7,
    angle:  Math.PI / 15,
    render: { 
      // fillStyle: getRandomColor(),
      sprite: {
        texture: '/images/matter/print-red-895x747.png',
        xScale: scale.value,
        yScale: scale.value
      }
    }
  });
  const print3 = Bodies.rectangle(w/2 - 500, -400, 895 * scale.value, 747 * scale.value, {
    restitution: 0.7,
    angle:  Math.PI / 12,
    render: { 
      // fillStyle: getRandomColor(),
      sprite: {
        texture: '/images/matter/print-white-895x747.png',
        xScale: scale.value,
        yScale: scale.value
      }
    }
  });
  const somet = Bodies.rectangle(w/2, 500, 1510 * scale.value, 307 * scale.value, {
    restitution: 0.7,
    angle:  Math.PI/10 ,
    render: { 
      // fillStyle: getRandomColor(),
      sprite: {
        texture: '/images/matter/somet-1510x307.png',
        xScale: scale.value,
        yScale: scale.value
      }
    }
  });
  const sum = Bodies.rectangle(w/2, -50, 2050 * scale.value * .2, 2050 * scale.value * .2, {
    restitution: 0.7,
    angle:  Math.PI/10 ,
    render: { 
      // fillStyle: getRandomColor(),
      sprite: {
        texture: '/images/matter/sum-2050x2050.png',
        xScale: scale.value * .2,
        yScale: scale.value * .2
      }
    }
  });
  // Add all bodies to the world
  Composite.add(world, [
    ground, ceiling, leftWall, rightWall,
    // circle1, rect1, poly1, bigBall,
    battery, harddrive2, print2, print3, sum

  ]);
  
  // Add mouse control
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  
  Composite.add(world, mouseConstraint);
  
  // Keep the mouse in sync with rendering
  render.mouse = mouse;
  
  // Handle window resize with debounce
  let resizeTimeout;
  // Handle window resize
  window.addEventListener('resize', () => {
    /* if (window.innerWidth > 800) {
      render.options.width = 800;
    } else {
      render.options.width = window.innerWidth - 40;
    }
    render.options.height = 600; */
    render.options.width = window.innerWidth
    // Update renderer
    Render.setPixelRatio(render, window.devicePixelRatio);
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: render.options.width, y: render.options.height }
    });
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reload the entire page
      window.location.reload();
    }, 500); // 500ms debounce to prevent multiple reloads during resize

  });
  document.addEventListener('click', (e) => {
    // createShape(e.clientX, e.clientY);
  });
  
  // Run the engine and renderer
  Render.run(render);
  runner = Runner.create();
  Runner.run(runner, engine);
  
  // Add a touch of gravity
  engine.gravity.y = 1.5;

  
});

// Clean up on component unmount
onUnmounted(() => {
  if (runner) {
    Runner.stop(runner);
    runner = null;
  }
  
  if (render) {
    Render.stop(render);
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    render.textures = {};
    render = null;
  }
  
  if (engine) {
    Engine.clear(engine);
    engine = null;
  }
  
  world = null;
});

// Helper functions
const getRandomColor = () => {
  const colors = [
    '#ff6b6b', '#ff9e7d', '#feca57', '#1dd1a1', 
    '#5f27cd', '#48dbfb', '#54a0ff', '#00d2d3'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Add shapes functions /////////////////////////////////////////////
/* 
 ________  ________  ________          ________  ___  ___  ________  ________  _______   ________      
|\   __  \|\   ___ \|\   ___ \        |\   ____\|\  \|\  \|\   __  \|\   __  \|\  ___ \ |\   ____\     
\ \  \|\  \ \  \_|\ \ \  \_|\ \       \ \  \___|\ \  \\\  \ \  \|\  \ \  \|\  \ \   __/|\ \  \___|_    
 \ \   __  \ \  \ \\ \ \  \ \\ \       \ \_____  \ \   __  \ \   __  \ \   ____\ \  \_|/_\ \_____  \   
  \ \  \ \  \ \  \_\\ \ \  \_\\ \       \|____|\  \ \  \ \  \ \  \ \  \ \  \___|\ \  \_|\ \|____|\  \  
   \ \__\ \__\ \_______\ \_______\        ____\_\  \ \__\ \__\ \__\ \__\ \__\    \ \_______\____\_\  \ 
    \|__|\|__|\|_______|\|_______|       |\_________\|__|\|__|\|__|\|__|\|__|     \|_______|\_________\
                                          \|_________|                                      \|_________|
*/

const addCircle = () => {
  if (!world) return;
  
  const width = render.options.width;
  const circle = Bodies.circle(
    Math.random() * width * 0.8 + width * 0.1,
    50,
    15 + Math.random() * 30,
    {
      restitution: 0.7 + Math.random() * 0.3,
      render: { fillStyle: getRandomColor() }
    }
  );
  
  Composite.add(world, circle);
};

const addRectangle = () => {
  if (!world) return;
  
  const width = render.options.width;
  const rectangle = Bodies.rectangle(
    Math.random() * width * 0.8 + width * 0.1,
    50,
    30 + Math.random() * 50,
    30 + Math.random() * 50,
    {
      chamfer: { radius: 5 },
      render: { fillStyle: getRandomColor() }
    }
  );
  
  Composite.add(world, rectangle);
};

const resetWorld = () => {
  if (!world) return;
  
  // Remove all bodies except walls
  const bodies = Composite.allBodies(world);
  bodies.forEach(body => {
    if (!body.isStatic) {
      Composite.remove(world, body);
    }
  });
};

const createShape = (x, y) => {
  if (!world) return;
  
  // const shape = Bodies.circle(x, y, 200 + 20 * Math.random(),
  const shape = Bodies.rectangle(x, y, 895 / 2 , 747 / 2, {
    render: { 
      // fillStyle: getRandomColor() 
      sprite: {
        texture: '/images/asset1.png',
        xScale: 0.5,
        yScale: 0.5
      }
    }
  });
  
  Composite.add(world, shape);
}
</script>

<style scoped>

  .matter-page {
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 100%;
    overflow-x: hidden;
    background-color: #e6e6e6;

  }

  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  button {
    padding: 8px 16px;
    background-color: #54a0ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #2e86de;
  }

  button:active {
    transform: scale(0.97);
  }

  .somet-pic {
    position: fixed;
    /* top: 10vh; */
    top: 0;
    left: 20px;
    width: 30vw;
    margin-top: 20px;
    margin-bottom: 20px;
    z-index: 0.5;
  }
  .somet-pic img {
    width: 100%;
  }

  #matter-container {
    /* width: 800px;
    max-width: calc(100vw - 40px);
    height: 600px;
    border-radius: 8px;
    overflow: hidden; */
    background-color: none;
    z-index: 1;
  }

  /* @media (max-width: 840px) {
    #matter-container {
      width: calc(100vw - 40px);
    }
  } */
</style>