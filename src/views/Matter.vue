<template>
  <div class="matter-page">
    <h1>Matter.js Physics Playground</h1>
    <div class="controls">
      <button @click="addCircle">Add Circle</button>
      <button @click="addRectangle">Add Rectangle</button>
      <button @click="resetWorld">Reset</button>
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

// Module aliases
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;

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
      width: window.innerWidth > 800 ? 800 : window.innerWidth - 40,
      height: 600,
      wireframes: false,
      background: '#f4f4f8'
    }
  });
  
  // Create boundaries
  const wallThickness = 50;
  const width = render.options.width;
  const height = render.options.height;
  
  // Create walls
  const ground = Bodies.rectangle(width/2, height + wallThickness/2, width + wallThickness, wallThickness, { 
    isStatic: true,
    render: { fillStyle: '#2e2b44' } 
  });
  const ceiling = Bodies.rectangle(width/2, -wallThickness/2, width + wallThickness, wallThickness, { 
    isStatic: true,
    render: { fillStyle: '#2e2b44' } 
  });
  const leftWall = Bodies.rectangle(-wallThickness/2, height/2, wallThickness, height, { 
    isStatic: true,
    render: { fillStyle: '#2e2b44' } 
  });
  const rightWall = Bodies.rectangle(width + wallThickness/2, height/2, wallThickness, height, { 
    isStatic: true,
    render: { fillStyle: '#2e2b44' } 
  });
  
  // Add initial bodies
  const circle1 = Bodies.circle(200, 50, 30, {
    restitution: 0.8,
    render: { fillStyle: '#ff6b6b' }
  });
  
  const rect1 = Bodies.rectangle(400, 200, 60, 60, {
    render: { fillStyle: '#48dbfb' }
  });
  
  const poly1 = Bodies.polygon(300, 100, 5, 40, {
    render: { fillStyle: '#1dd1a1' }
  });
  
  // Add all bodies to the world
  Composite.add(world, [
    ground, ceiling, leftWall, rightWall,
    circle1, rect1, poly1
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
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      render.options.width = 800;
    } else {
      render.options.width = window.innerWidth - 40;
    }
    render.options.height = 600;
    
    // Update renderer
    Render.setPixelRatio(render, window.devicePixelRatio);
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: render.options.width, y: render.options.height }
    });
  });
  
  // Run the engine and renderer
  Render.run(render);
  runner = Runner.create();
  Runner.run(runner, engine);
  
  // Add a touch of gravity
  engine.gravity.y = 1;
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

// Add shapes functions
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
</script>

<style scoped>
  .matter-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 100%;
    overflow-x: hidden;
  }

  h1 {
    margin-bottom: 20px;
    color: #2e2b44;
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

  #matter-container {
    width: 800px;
    max-width: calc(100vw - 40px);
    height: 600px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 840px) {
    #matter-container {
      width: calc(100vw - 40px);
    }
  }
</style>