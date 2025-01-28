<template>
  <div class="project-show">
    <header>this is just header</header>
    <h1>test</h1>
  </div>
</template>
<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .project-show {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 200vh;
    width: 100vw;
    background-color: #ff0000;
    margin: 0;
    padding: 0;

    position: relative;

  }

  header {
    width: 100%;

    background-color: #0000ff;

    position: absolute;
    top: 0;
  }
</style>