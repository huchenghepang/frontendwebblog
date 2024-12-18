<template>
    <!-- 圆球元素 -->
    <div
        ref="ball"
        class="ball"
        :class="{miniball:isShowBtn}"
        :style="{ top: `${position.y}px`, left: `${position.x}px` }"
        @mousedown="startDrag"
        @touchstart="startDrag"
        @click="handleClick"
    >
        <div class="btn-contaniner " ref="btn" >
            <div class="placeholder" style="width: 45px; height: 45px" v-if="!isShowBtn"></div>
            <template v-if="isShowBtn">
                <button @click="leave">离开</button>
                <button @click="close">关闭</button>
                <button @click="reEnter">重新进入</button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import emitter from '@/utils/mitt';

export default {
    setup() {
        const ball = ref(null) // 获取圆球元素的引用
        const position = reactive({ x: 0, y: 300 }) // 小球的初始位置
        const dragging = ref(false) // 判断是否正在拖动
        const offset = reactive({ x: 0, y: 0 }) // 记录鼠标按下时的偏移量
        const windowWidth = ref(window.innerWidth)
        const windowHeight = ref(window.innerHeight)
        const ballSize = ref(45) // 小球的大小
        const ballHeight = ref(45)
        const isShowBtn = ref(false) // 是否显示按钮

        const handleMouseMove = (event:any) => {
            if (dragging.value) {
                const clientX = event.clientX || event.touches[0].clientX
                const clientY = event.clientY || event.touches[0].clientY

                // 更新小球的位置，并限制在屏幕范围内
                position.x = Math.min(Math.max(clientX - offset.x, 0), windowWidth.value - ballSize.value)
                position.y = Math.min(Math.max(clientY - offset.y, 0), windowHeight.value - ballHeight.value - 35) // 减去高度
            }
        }

        const startDrag = (event:any) => {
            dragging.value = true
            const clientX = event.clientX || event.touches[0].clientX
            const clientY = event.clientY || event.touches[0].clientY
            offset.x = clientX - position.x
            offset.y = clientY - position.y

            // 监听鼠标移动和触摸移动事件
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('touchmove', handleMouseMove)
            window.addEventListener('mouseup', stopDrag)
            window.addEventListener('touchend', stopDrag)
        }

        const stopDrag = () => {
            dragging.value = false
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchmove', handleMouseMove)
            window.removeEventListener('mouseup', stopDrag)
            window.removeEventListener('touchend', stopDrag)
        }

        const handleClick = () => {
            // 点击小球时执行的函数
            isShowBtn.value = !isShowBtn.value
            
        }

        const updateWindowSize = () => {
            windowWidth.value = window.innerWidth
            windowHeight.value = window.innerHeight
        }
        const updateBallSize = (width:number, height:number) => {
            ballHeight.value = height
            ballSize.value = width
        }
        onMounted(() => {
            window.addEventListener('resize', updateWindowSize)
            openMonitor(btn.value!)
        })
        onBeforeUnmount(() => {
            resizeObserver.disconnect();
            console.log('llll');
            
        })

        onUnmounted(() => {
            window.removeEventListener('resize', updateWindowSize)
        })


        // 监听元素的宽高变化

        const resizeObserver = new ResizeObserver((entries) => {
                // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的信息
                entries.forEach((item) => {
                    const { width, height } = item.contentRect
                    //获取 监听元素的宽高
                    // 触发自定义的处理逻辑，
                    updateBallSize(width, height)
                })
            })
        const btn = ref(null)
        const openMonitor = (target:HTMLElement) => {
            //获取监听元素 id class ref
            console.log(target)
            // 创建 ResizeObserver 实例
            

            // 开始监听目标元素的大小变化
            resizeObserver.observe(target)
            return resizeObserver
        }


        const disConnetOberve =  (target:HTMLElement) => {
            // 关闭ResizeObserver监听器     
            if (resizeObserver) {
                resizeObserver.unobserve(target)
                console.log('hhh');
            }
        }


        function leave(){
            emitter.emit("leave")
        }
        function reEnter(){
            emitter.emit("reEnter")
        }
        function close(){
            emitter.emit("close")
        }
        return {
            ball,
            position,
            startDrag,
            handleClick,
            isShowBtn,
            openMonitor,
            updateBallSize,
            disConnetOberve,
            btn,
            resizeObserver,
            leave,
            reEnter,
            close
        }
    }
}
</script>

<style scoped lang="scss">
.ball {
    width: 45px;
    height: 45px;
    background-color: rgba(46, 148, 167, 0.7);
    border-radius: 50%;
    position: absolute;
    left: 0 ;
    top: 50% ;
    cursor: pointer;
    user-select: none; /* 禁止选中文本 */
    touch-action: none; /* 禁用默认触摸动作，如滚动 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    .btn-contaniner {
        z-index: -999;
        transition: height 0.8s ease, opacity 0.9s ease; /* 高度和透明度的过渡效果 */
        button {
            width: 45px;
            border-radius: 15px;
            border: 1px solid #189ab1;
            margin: 4px 0;
            box-shadow: -1px 2px 2px #162427;
            opacity: 0.7;
            animation: expandAndFadeIn 1.4s cubic-bezier(0.075,0.165,0.8, 1) 0.1s;
        }
    }

    &:before {
        /* 里面的小球 */
        content: '';
        display: block !important;
        width: 20px;
        height: 20px ;
        border-radius: 50%;
        background-color: rgba(69, 67, 168, 0.4);
    }
}

.miniball{
    background-color: transparent !important;
}



@keyframes expandAndFadeIn {
  0% {
    height: 0;
    opacity: 0; 
  }
  50% {
    height: 50px; /* 可以根据实际内容调整 */
    opacity: 0.5;
  }
  100% {
    height: auto;
    opacity: 0.7;
  }
}

</style>
