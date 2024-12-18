<template>
    <div
        ref="container"
        class="falling-petals-container"
    />
</template>
  
<script setup>
import { ref, onMounted, watch } from 'vue';
  
// 定义组件的属性
const props = defineProps({
    count: { type: Number, default: 20 },
    speed: { type: Number, default: 5 },
    direction: { type: String, default: 'down' },
    imgSrc: { type: String, default: '' },        // 图片链接
    svgContent: { type: String, default: '' }     // SVG 内容
});
  
// 容器引用
const container = ref(null);
  
// 随机颜色生成
function getRandomColor() {
    const colors = ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093'];
    return colors[Math.floor(Math.random() * colors.length)];
}
  
// 创建花瓣元素
function createPetal() {
    let petal;
  
    if (props.svgContent) {
        // 如果传入 SVG 代码，创建 div 包裹 SVG 内容
        petal = document.createElement('div');
        petal.innerHTML = props.svgContent; // 插入 SVG 代码
  
        // 随机修改 SVG 内部 `fill` 属性的颜色
        const svgElement = petal.querySelector('svg');
        if (svgElement) {
            svgElement.style.fill = getRandomColor();
            svgElement.style.width = `${Math.random() * 20 + 20}px`;
            svgElement.style.height = 'auto';
        }
    } else if (props.imgSrc) {
        // 如果传入图片链接，创建 img 元素
        petal = document.createElement('img');
        petal.src = props.imgSrc;
        petal.style.width = `${Math.random() * 20 + 20}px`;
        petal.style.height = 'auto';
  
        // 为图片添加颜色滤镜
        petal.onload = () => {
            petal.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        };
    } else {
        // 默认生成彩色 div 花瓣
        petal = document.createElement('div');
        const size = Math.random() * 20 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.backgroundColor = getRandomColor();
        petal.style.borderRadius = '50%';
    }
  
    petal.classList.add('petal');
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${props.speed + Math.random() * 3}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
  
    return petal;
}
  
// 初始化花瓣动画
function initializePetals() {
    container.value.innerHTML = '';
  
    for (let i = 0; i < props.count; i++) {
        const petal = createPetal();
        container.value.appendChild(petal);
    }
}
  
// 监视 svgContent 变化
watch(() => props.svgContent, () => {
    initializePetals();
});
  
// 挂载后初始化
onMounted(() => {
    initializePetals();
});
</script>
  
  <style>
  .falling-petals-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
  }
  
  .petal {
    position: absolute;
    opacity: 0.8;
    animation: fall linear infinite;
  }
  
  /* 动画：包括左右摆动的下落效果 */
  @keyframes fall {
    0% {
      transform: translateX(0) translateY(-10vh) rotate(0deg);
      opacity: 0;
    }
    25% {
      transform: translateX(-10vw) translateY(25vh) rotate(90deg);
      opacity: 0.8;
    }
    50% {
      transform: translateX(10vw) translateY(50vh) rotate(180deg);
      opacity: 0.8;
    }
    75% {
      transform: translateX(-10vw) translateY(75vh) rotate(270deg);
      opacity: 0.8;
    }
    100% {
      transform: translateX(0) translateY(110vh) rotate(360deg);
      opacity: 0;
    }
  }
  </style>
  