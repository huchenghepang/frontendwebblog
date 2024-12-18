<template>
    <div class="cube-container">
      <div class="cube" :style="{ transform: `rotateX(${xRotation}deg) rotateY(${yRotation}deg)` }">
        <div class="face front"><img :src="imagesList[0]" alt="" srcset="" class="cube-img"></div>
        <div class="face back"><img :src="imagesList[1]" alt="" srcset="" class="cube-img"></div>
        <div class="face left"><img :src="imagesList[2]" alt="" srcset="" class="cube-img"></div>
        <div class="face right"><img :src="imagesList[3]" alt="" srcset="" class="cube-img"></div>
        <div class="face top"><img :src="imagesList[4]" alt="" srcset="" class="cube-img"></div>
        <div class="face bottom"><img :src="imagesList[5]" alt="" srcset="" class="cube-img"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const xRotation = ref(0);
  const yRotation = ref(0);
  defineProps(["imagesList"])
  
  function handleMouseMove(event) {
    const x = event.clientX / window.innerWidth * 360;
    const y = event.clientY / window.innerHeight * 360;
    xRotation.value = y;
    yRotation.value = x;
  }
  
  window.addEventListener('mousemove', handleMouseMove);
  
  </script>
  
  <style scoped>
  .cube-container {
    perspective: 1000px;
  }
  
  .cube {
    position: relative;
    width: 200px;
    height: 200px;
    transform-style: preserve-3d;
    transform: rotateX(0deg) rotateY(0deg);
    transition: transform 0.5s;
  }
  
  .face {
    position: absolute;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    text-align: center;
    line-height: 200px;
    font-size: 24px;

    .cube-img{
      width: 200px;
      height: 200px;
      object-fit: cover;
    }
  }
  
  .front  { transform: translateZ(100px); }
  .back   { transform: rotateY(180deg) translateZ(100px); }
  .left   { transform: rotateY(-90deg) translateZ(100px); }
  .right  { transform: rotateY(90deg) translateZ(100px); }
  .top    { transform: rotateX(90deg) translateZ(100px); }
  .bottom { transform: rotateX(-90deg) translateZ(100px); }
  </style>