<template>
    <svg :width="width" :height="height" xmlns="http://www.w3.org/2000/svg">
      <g v-for="(drop, index) in raindrops" :key="index">
        <path :d="drop.pathData" :fill="drop.fill" :stroke="drop.stroke" :stroke-width="drop.strokeWidth" />
      </g>
    </svg>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const props = defineProps({
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    numDrops: {
      type: Number,
      default: 10
    }
  });
  
  const raindrops = ref([]);
  
  onMounted(() => {
    for (let i = 0; i < props.numDrops; i++) {
      const x = Math.random() * props.width;
      const y = Math.random() * props.height;
      const sizeFactor = Math.random() * 0.8 + 0.6;
  
      const pathData = `M${x},${y} C${x + 5 * sizeFactor},${y + 20 * sizeFactor} ${x - 5 * sizeFactor},${y + 20 * sizeFactor} ${x},${y + 40 * sizeFactor} C${x + 5 * sizeFactor},${y + 60 * sizeFactor} ${x - 5 * sizeFactor},${y + 60 * sizeFactor} ${x},${y + 80 * sizeFactor} C${x + 5 * sizeFactor},${y + 100 * sizeFactor} ${x - 5 * sizeFactor},${y + 100 * sizeFactor} ${x},${y + 120 * sizeFactor} C${x + 5 * sizeFactor},${y + 140 * sizeFactor} ${x - 5 * sizeFactor},${y + 140 * sizeFactor} ${x},${y + 160 * sizeFactor} C${x + 5 * sizeFactor},${y + 180 * sizeFactor} ${x - 5 * sizeFactor},${y + 180 * sizeFactor} ${x},${y + 200 * sizeFactor}`;
  
      raindrops.value.push({
        pathData,
        fill: 'skyblue',
        stroke: 'lightblue',
        strokeWidth: '2'
      });
    }
  });
  </script>
  
  <style scoped>
  /* 可以在这里添加组件相关的样式 */
  </style>