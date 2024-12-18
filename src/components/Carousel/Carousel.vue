<template>
    <div v-if="isOpen" ref="overlay" class="overlay" @touchstart.stop="handleTouchStart" @touchend.stop="handleTouchEnd"
        @click="closePopup">
        <div class="carousel clearfix" @click.stop>
            <button class="close-btn" @click="closePopup">
                ❎
            </button>
            <button class="prev-btn" @click="prevImage">
                ◀️
            </button>
            <div class="carousel-content clearfix">

                <div class="image-container">
                    <img class="img" :src="images[currentIndex]" @click="closePopup"></img>
                </div>

            </div>
            <button class="next-btn" @click="nextImage">
                ▶️
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { visualHiddenProps } from 'element-plus/es/components/visual-hidden/index.mjs';
    import { ref, defineProps, toRefs, watch } from 'vue'

    // 组件属性和状态
    const props = defineProps({
        images: {
            type: Array,
            default: [
            ]
        },
        isOpen: {
            type: Boolean,
            default: false
        }
    })

    const { images, isOpen } = toRefs(props)

    const currentIndex = ref(0)



    const $emit = defineEmits(['close']);
    const closePopup = () => {
        enableScroll();
        $emit("close", false)
    }


    function disableScroll() {
        // 确保 html 元素也不能滚动
        //    document.documentElement.style.overflow = 'hidden'; // 禁用 html 滚动
        document.body.style.overflow = 'hidden'; // 禁用 body 滚动
        document.body.style.position = 'fixed'; // 固定位置
        document.body.style.top = '0'; // 防止页面顶部偏移
        document.body.style.width = '100%'; // 防止页面宽度变化
    }

    function enableScroll() {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
    }




    //#region 处理元素的左移或者右移的
    /* 处理滚动图片 */
    let startX = ref(0);
    let endX = ref(0);
    const threshold = 30 // 偏移量 距离
    // 触摸开始事件处理函数
    const handleTouchStart = (event: TouchEvent) => {
        startX.value = event.touches[0].clientX;
    };

    // 触摸结束事件处理函数
    const handleTouchEnd = (event: TouchEvent) => {
        endX.value = event.changedTouches[0].clientX;
        handleSwipe()
    };


    function handleSwipeLeft() {
        prevImage()

    }

    function handleSwipeRight() {
        nextImage()
    }
    function handleSwipe() {
        const distance = endX.value - startX.value;
        if (Math.abs(distance) > threshold) {
            if (distance > 0) {
                handleSwipeRight()

            } else {
                handleSwipeLeft()
            }
        }
    }
    //#endregion



    const prevImage = () => {
        if (!images.value.length) return
        currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
    }

    const nextImage = () => {
        if (!images.value.length) return
        currentIndex.value = (currentIndex.value + 1) % images.value.length
    }

    const overlay = ref<null | HTMLElement>(null);


    watch(() => props.isOpen, (newValue) => {
        if (newValue) {
            console.log('阻止滚动');
            disableScroll()
        }
    })
</script>

<style scoped lang="scss">
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        pointer-events: auto;
        /* 允许遮罩层自身接收点击事件 */
    }

    .carousel {
        position: relative;
        min-height: 80%;
        min-width: 80%;

        border-radius: 20px;
        text-align: center;
        background-image:
            radial-gradient(at 40% 20%, hsla(28, 100%, 74%, 1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 1) 0px, transparent 50%),
            radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 1) 0px, transparent 50%);
        backdrop-filter: blur(2px);
        /* 应用模糊效果 */
        -webkit-backdrop-filter: blur(2px);
        /* 兼容 Webkit 浏览器 */
        border-radius: 10px;
        /* 可选的圆角 */
    }

    .carousel-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }


    .image-container {
        width: 100%;
        height: 100%;

        .img {
            border: 1px solid rgba(0, 0, 0, 0.2);
        }
    }


    .close-btn,
    .prev-btn,
    .next-btn {
        cursor: pointer;
        position: absolute;
        padding: 5px 10px;
        margin: 0 5px;
        background-image: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%);
        border: 1px solid transparent;
        border-radius: 20px;
        z-index: 2;

        &:hover {
            background: #975d39;
        }
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-image: linear-gradient(45deg, #874da2 0%, #c43a30 100%);
    }

    .prev-btn,.next-btn{
        top: 50%;
        width: 50px;
        transform: translateY(-50%);

        @media screen and (max-width:768px) {
            display: none;
        }
    }

    .prev-btn{
        left: 10px;
    }

    .next-btn{
        right: 10px;
    }


    @media screen and (max-width:768px) {

        .carousel {
            width: 100vw;
            height: 100vh;
            padding: 0;

            .carousel-content {
                height: 100vh;
                width: 100vw;

                .image-container {
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .img {
                        max-width: 100vw;
                        max-height: 100vh;
                        object-fit: cover;
                    }
                }




            }
        }

        .next-btn,
        .prev-btn {
            position: fixed !important;
        }

        .next-btn {
            top: 50%;
            transform: translateY(-50%);
            right: 10px;
        }

        .prev-btn {
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
        }

        .close-btn {
            top: 5%;
            right: 5%;
            width: 3rem;
            height: 3rem;
            text-align: center;
            justify-content: center;
            display: flex;
            align-items: center;
            font-size: medium;
            color: #c43a30;
        }

    }
</style>
