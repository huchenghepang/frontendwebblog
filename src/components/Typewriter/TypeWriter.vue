<template>
    <p>
        <template
            v-for="(paragraph, index) in textArray"
            :key="index"
        >
            <span v-html="paragraphsText[index]" />
            <!-- 打印完当前段落后添加光标 -->
            <span
                v-if="index === currentParagraphIndex && showCursor"
                class="cursor"
            >_</span>
            <br v-if="index < textArray.length - 1">
        </template>
    </p>
</template>
  
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
  
// 接收外部传入的数组对象和打字速度
const props = defineProps({
    textArray: {
        type: Array as PropType<string[]>,
        required: true,
    },
    speed: {
        type: Number,
        default: 100, // 默认每个字符间隔 100 毫秒
    },
});
  
const paragraphsText = ref(props.textArray.map(() => '')); // 用来存储每段打印的文本
const currentParagraphIndex = ref(0); // 当前段落索引
const showCursor = ref(true); // 控制光标的显示与隐藏
  
let interval: number | null = null;
let cursorInterval: number | null = null;
  
// 打字机效果函数
const typeWriter = (textArray: string[], speed: number) => {
    if (!textArray?.length) return;
  
    // 清除之前的定时器，避免重复执行
    if (interval) {
        clearInterval(interval);
    }
  
    let paragraphIndex = 0; // 当前段落索引
    let charIndex = 0; // 当前字符索引
  
    // 立即执行一次字符打印逻辑，减少初始延迟
    const printChar = () => {
        const currentParagraph = textArray[paragraphIndex];
        
        // 如果当前段落是空的
        if (!currentParagraph) {
            paragraphIndex++;
            charIndex = 0;
            return;
        }

        // 将逐字打印的字符添加到当前段落中
        paragraphsText.value[paragraphIndex] += currentParagraph.charAt(charIndex);
        charIndex++;
  
        // 如果当前段落打印完成，处理下一个段落
        if (charIndex >= currentParagraph.length) {
            paragraphIndex++;
            charIndex = 0;
        }
  
        // 如果所有段落都打印完，清除定时器
        if (paragraphIndex >= textArray.length) {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        }
    };
  
    // 先执行一次打印逻辑
    printChar();
  
    // 然后启动定时器，逐步打印
    interval = setInterval(printChar, speed);
};
  
// 控制光标的闪烁
const startCursorBlink = () => {
    cursorInterval = window.setInterval(() => {
        showCursor.value = !showCursor.value;
    }, 500); // 光标每 500ms 切换一次
};
  
// 组件挂载时开始打字效果和光标闪烁
onMounted(() => {
    typeWriter(props.textArray, props.speed);
    startCursorBlink();
});
  
// 监听文本变化时重启打字效果
watch(() => props.textArray, (newTextArray) => {
    paragraphsText.value = newTextArray.map(() => ''); // 重置文本
    currentParagraphIndex.value = 0; // 重置段落索引
    typeWriter(newTextArray, props.speed);
});
  
// 组件卸载时清理定时器
onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
    }
    if (cursorInterval) {
        clearInterval(cursorInterval);
    }
});
</script>
  
  <style lang="scss" scoped>
  .cursor {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: black;
    animation: blink 1s step-start infinite;
  }
  
  @keyframes blink {
    50% {
      background-color: transparent;
    }
  }
  </style>
  