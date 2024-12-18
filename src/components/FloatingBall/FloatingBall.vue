<template>
    <div
        ref="ball"
        class="floating-ball"
        :style="{ top: `${position.y}px`, left: `${position.x}px` }"
        @mousedown="startDrag"
        @touchstart="startDrag"
        @click="handleClick"
    >
        <div
            ref="btn"
            class="button-container"
        >
            <template v-if="isShowBtn || isAlwayShow">
                <slot /> <!-- 使用插槽来传递按钮内容 -->
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';

export default {
    name: 'FloatingBall',
    props: {
        isAlwayShow: {
            type: Boolean,
            default: false
        },
    },
    setup(props) {
        const ball = ref(null);
        const position = reactive({ x: 0, y: 300 });
        const dragging = ref(false);
        const offset = reactive({ x: 0, y: 0 });
        const isShowBtn = ref(false);
        const windowWidth = ref(window.innerWidth);
        const windowHeight = ref(window.innerHeight);
        const ballSize = 45; // 小球的尺寸



        const handleMouseMove = (event: MouseEvent | TouchEvent) => {
            if (dragging.value) {
                const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
                const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

                // 更新小球的位置，并限制在屏幕范围内
                position.x = Math.min(Math.max(clientX - offset.x, 0), windowWidth.value - ballSize - 20);
                position.y = Math.min(Math.max(clientY - offset.y, 0), windowHeight.value - ballSize / 2);
            }
        };

        const startDrag = (event: MouseEvent | TouchEvent) => {
            dragging.value = true;
            const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
            const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

            offset.x = clientX - position.x;
            offset.y = clientY - position.y;

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('mouseup', stopDrag);
            window.addEventListener('touchend', stopDrag);
        };

        const stopDrag = () => {
            dragging.value = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchend', stopDrag);
        };

        const handleClick = () => {
            if (props.isAlwayShow) return;
            isShowBtn.value = !isShowBtn.value;
        };

        const updateWindowSize = () => {
            windowWidth.value = window.innerWidth;
            windowHeight.value = window.innerHeight;

            // 确保在窗口大小变化时调整小球位置
            position.x = Math.min(position.x, windowWidth.value - ballSize);
            position.y = Math.min(position.y, windowHeight.value - ballSize);
        };

        onMounted(() => {
            window.addEventListener('resize', updateWindowSize);
        });

        onUnmounted(() => {
            stopDrag();
            window.removeEventListener('resize', updateWindowSize);
        });

        return {
            ball,
            position,
            startDrag,
            handleClick,
            isShowBtn,
        };
    },
};
</script>

<style scoped lang="scss">
    .floating-ball {
        width: 35px;
        height: 35px;
        background-color: rgba(46, 148, 167, 0.7);
        border-radius: 50%;
        position: fixed;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;

        .button-container {
            display: block;

        }

        &.active .button-container {
            display: flex;
        }



    }


    /* 媒体查询 */
    @media screen and (max-width:768px) {
        .floating-ball {
            width: 30px;
            height: 30px;
            font-size: 14px;
            right: 0px !important;
            left: 0px !important;
        }
    }
</style>
