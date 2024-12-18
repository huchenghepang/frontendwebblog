<template>
        <input class="bck-color-picker" v-tip="`选择切换笔记背景色`" type="color" v-model="color" @input="updateBackgroundColor" />
</template>

<script>
import { ref, watch, onMounted, nextTick } from 'vue'

export default {
    setup(props) {
        const color = ref('ffffff')
        // 页面加载时应用背景颜色
        onMounted(() => {
            color.value = localStorage.getItem('notebook-background-color')
            applyBackgroundColor(color.value)
        })

        // 更新背景颜色并将其保存在 localStorage 中
        const updateBackgroundColor = () => {
            localStorage.setItem('notebook-background-color', color.value)
            nextTick(() => {
                applyBackgroundColor(color.value)
            })
        }

        // 动态应用背景颜色到 CSS 变量
        const applyBackgroundColor = (newColor) => {
            const currentColor = localStorage.getItem('notebook-background-color')
            if (currentColor) {
                document.documentElement.style.setProperty('--notebook-background-color', newColor)
            }
        }

        // 监听 props 变化，动态更新背景颜色
        watch(color, (newColor) => {
            color.value = newColor
            applyBackgroundColor(newColor)
        })

        return {
            color,
            updateBackgroundColor
        }
    }
}
</script>

<style scoped>
/* 样式可以进行适当调整 */
input[type='color'] {
    width: 30px; /* 设置宽度 */
    height: 30px; /* 设置高度，和宽度相同，形成正方形 */
    display: inline-block;
    border: none; /* 去除默认边框，视需求可添加 */
    padding: 0;
    cursor: pointer; /* 鼠标悬停时显示指针 */
    outline: none; /* 取消默认的焦点外观 */
}



@media screen and (max-width: 768px) {
    .bck-color-picker {
        z-index: 99999;
    }
}
</style>
