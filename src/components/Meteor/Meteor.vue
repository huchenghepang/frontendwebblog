<template>
    <div class="meteor-container">
        <div v-for="n in number" :key="n" class="meteor" />
    </div>
</template>
  
<script lang="ts" setup>
const props = defineProps({
    number: {
        type: Number,
        default: 15
    }
})
</script>
  
  <style lang="scss" scoped>
  /* 流星效果容器 */
  .meteor-container {
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100vw - 200px);
    height: 100vh;
    z-index: -1; /* 确保流星效果位于页面内容的下方 */
  }
  
  /* 使用::before伪元素来添加背景色 */
  .meteor-container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    min-height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: linear-gradient(to bottom, #000, #001f3f); /* 深色背景，模拟夜空 */
    z-index: -2; /* 确保背景色位于流星下方 */
  }
  
  /* 流星基础样式 */
  .meteor {
    position: absolute;
    border-radius: 50%;
    opacity: 0;
    width: 3px;
    height: 3px;
    animation: meteor-fall 2s linear infinite;
  }
  
  /* 流星下落的动画 */
  @keyframes meteor-fall {
    0% {
      transform: translateY(-100px) translateX(400px) rotate(45deg);
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateY(800px) translateX(-400px) rotate(45deg);
      opacity: 0;
    }
  }
  
  /* 使用 mixin 和 @for 循环生成随机流星样式，包含颜色 */
  @mixin random-meteor($index) {
    $top: math.random(50) * -1 + px; // 随机从页面顶部上方偏移
    $left: math.random(100) * 1%;; // 随机水平位置
    $width: math.random(4) + 1 + px; // 随机宽度 1px - 5px
    $height: math.random(120) + 40 + px; // 随机高度 40px - 160px
    $duration: math.random(3) + 2 + s; // 随机动画时间 2s - 5s
    $delay: math.random(10) * 0.1 + s; // 随机动画延迟 0s - 1s
  
    // 随机颜色选择
    $colors: (
      linear-gradient(white, rgba(255, 255, 255, 0)),
      linear-gradient(orange, rgba(255, 165, 0, 0)),
      linear-gradient(aqua, rgba(0, 255, 255, 0)),
      linear-gradient(gold, rgba(255, 215, 0, 0)),
      linear-gradient(purple, rgba(128, 0, 128, 0))
    );
    $color: nth($colors, math.random(length($colors)));
  
    .meteor:nth-child(#{$index}) {
      top: #{$top};
      left: #{$left};
      width: #{$width};
      height: #{$height};
      animation-duration: #{$duration};
      animation-delay: #{$delay};
      background: $color; // 使用随机颜色
    }
  }
  
  /* 为每个流星生成随机样式和颜色 */
  @for $i from 1 through 15 {
    @include random-meteor($i);
  }
  
  @media screen and (max-width: 768px) {
    .meteor-container {
      display: none;
    }
  }
  </style>
  