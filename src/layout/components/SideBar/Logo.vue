<template>
    <div class="Logo-container">
        <!-- 条件渲染图标 -->
        <div
            v-if="showIcon"
            class="Logo-icon"
        >
            <img
                src="/public/favicon.ico"
                alt="Logo icon"
            >
        </div>
        <!-- 3D效果的Logo标题 -->
        <div
            v-if="isShowTitle"
            class="Logo-title"
        >
            {{ title }}
        </div>
    </div>
</template>
  
<script lang="ts" name='Logo' setup>
import { ref } from 'vue'
  
// 接收两个props：showIcon 控制是否显示图标，iconSrc 用于传递图标的路径，title 用于Logo标题文本
const props = defineProps({
    showIcon: {
        type: Boolean,
        default: true
    },
    iconSrc: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: '天空之城'
    },
    isShowTitle:{
        type:Boolean,
        default:true
    }
})
</script>
  
  <style scoped lang="scss">
  .Logo-container {
    width: 100%;
    height:60px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    color: #050404;
    
    @include filter_invert();
  }
  
  .Logo-icon img {
    width: 60px;
    height: 100%;
    padding: 10px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .Logo-title {
    width: calc(100% - 50px ) !important;
    height: 100%;
    box-sizing: border-box;
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
    color: #8b7a7a;
    position: relative;
  

  }
  </style>
  