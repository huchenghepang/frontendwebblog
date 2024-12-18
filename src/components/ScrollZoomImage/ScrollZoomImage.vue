<template>
    <div class="wrapper">
        <div class="content">
            <div class="section hero">
                <!-- 动态壁纸 -->

                <video class="video" src="../../../public/source/mp4/home-video.mp4" autoplay loop muted playsinline />
            </div>
            <div class="section explore">
                <img class="img" src="/public/source/webp/image.png" alt="">
                <div class="text-3d">
                    Believe in the future
                </div>
                <div class="text-3d bottom">
                    相信未来
                </div>
                <div class="right-contaniner">

                </div>
                <ArticleNework style="z-index: 999;" :nodes="notesCounts"></ArticleNework>
            </div>
            <div class="main glass">
                <div ref="mainTitle" class="gradient-title">
                    <span v-for="(letter, index) in mainTitleInfo.split('')" :key="index"
                        :style="`animation-delay:${index / 10}s ;`" class="dbounce-span">{{ letter }}</span>
                </div>
                <h2 ref="subTitle" class="sub-title">
                    天空之城
                </h2>
                <p>
                    在互联网的浩瀚星河中，有一座神秘且璀璨的
                    “天空之城”，那便是我的博客。它悬浮于知识与创意的交界，宛如一座梦幻驿站，等待着每一位求知若渴、怀揣好奇心的旅人。
                </p>
                <p>
                    这座 “天空之城”
                    就好像是一座充满魔法的知识花园。每一篇文章都是一颗精心培育的种子，在这里生根发芽，绽放出独特的思想之花。
                </p>
                <Typewriter :text-array="lastParagraph" :speed="50" />
                <div class="btn btn-borders">
                    <span class="btn-text" @click="goArticle">探索之旅</span>
                </div>
                <div class="crack" />
                <div class="crack" />
            </div>

        </div>
        <div class="image-container">

            <img :src="src" alt="Zoomed Image">
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, onBeforeUnmount, defineProps, ref, computed } from 'vue'
    import { gsap } from 'gsap'
    import ScrollTrigger from 'gsap/ScrollTrigger'
    import { useArticleStore } from '@/stores/modules/article'
    import Typewriter from '@/components/Typewriter/TypeWriter.vue'
    import { useRouter } from 'vue-router'
    import { filterEventAttributes, filterScript } from '@/utils/filterScript'
    import ArticleNework from '../ArticleNework/ArticleNework.vue'
    import { storeToRefs } from 'pinia'
    gsap.registerPlugin(ScrollTrigger)


    const lastParagraph = computed(() => {
        if (!articleStore.articlesNumber) {
            return ['']
        } else {
            let content = `截至目前，我已创作和整理了<strong>${articleStore.articlesNumber}</strong> 篇笔记,记录着人生旅途中的各种思考与见解。
        这些文章共分为<strong>${articleStore.categoriesNumber}</strong>个类别，其中${articleStore.categoryCounts[0]['category_name']}、
        ${articleStore.categoryCounts[1]['category_name']}和${articleStore.categoryCounts[2]['category_name']}拥有的笔记数量最多
        ，分别为${articleStore.categoryCounts[0]['note_count']}篇、${articleStore.categoryCounts[1]['note_count']}篇和${articleStore.categoryCounts[2]['note_count']}篇。
        并且根据文章内容的相关性归纳为不同的标签，一共拥有<strong>${articleStore.tagsNumber}个标签</strong>,其中${articleStore.tagCounts[0]['tag_name']}、
        ${articleStore.tagCounts[1]['tag_name']}和${articleStore.tagCounts[2]['tag_name']}三个标签拥有的笔记数量最多
        ，分别为${articleStore.tagCounts[0]['note_count']}篇、${articleStore.tagCounts[1]['note_count']}篇和${articleStore.tagCounts[2]['note_count']}篇
        。这些内容从技术探讨到生活感悟，每一个文字都承载着启发与共鸣。最后，希望，我们每个人都能在自我实现的人生道路上，走向自由和幸福!`

            content = filterEventAttributes(
                filterScript(content.replaceAll(/\s/g, '').replaceAll('\n', '').replaceAll('\t', ''))
            )
            return [content]
        }
    })

    defineProps({
        src: {
            type: String,
            default:
                'https://assets-global.website-files.com/63ec206c5542613e2e5aa784/643312a6bc4ac122fc4e3afa_main%20home.webp'
        }
    })
    const router = useRouter()
    function goArticle() {
        router.replace({
            name: 'article'
        })
    }

    const articleStore = useArticleStore();
    const { notesCounts } = storeToRefs(articleStore)
    const subTitle = ref<HTMLElement | null>(null)
    const mainTitle = ref<HTMLElement | null>(null)

    const mainTitleInfo = ref('欢迎来到我的博客')

    onMounted(() => {
        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.wrapper',
                start: 'top top',
                end: '+=120%',
                pin: true,
                scrub: true,
                markers: false
            }
        })

        scrollTimeline
            .to('.image-container img', {
                scale: 2,
                z: 350,
                transformOrigin: 'center center',
                ease: 'power1.inOut'
            })
            .to(
                '.section.hero',
                {
                    scale: 1,
                    transformOrigin: 'center center',
                    ease: 'power1.inOut'
                },
                '<'
            )
        if (articleStore.tagCounts.length === 0) {
            articleStore.getAricleTagAndCategoryInfo()
        }
    })

    onBeforeUnmount(() => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    })
</script>

<style scoped lang="scss">
    @function float-text-3d($shadow-color: #bbb, $depth: 10, $floating: false) {
        $shadows: (
        );

    // When dropped, it will shrink like a spring. When floating, it grows into its shape.
    @for $i from 1 to $depth {
        @if ($floating ==false and $i > math.div($depth, 2)) {
            $shadow-color: transparent;
        }

        $shadows: list.append($shadows, 0 50px 25px rgba(0, 0, 0, 0.2), comma);
    }

    // When dropped, the shadow reveals. When floating, the shadow fades.
    @if ($floating ==false) {
        $shadows: list.append($shadows, 0 10px 10px rgba(0, 0, 0, 0.4), comma);
    }

    @else {
        $shadows: list.append($shadows, 0 50px 25px rgba(0, 0, 0, 0.2), comma);
    }

    @return $shadows;
}

:root {
    * {
        box-sizing: border-box;
    }
}

@keyframes dbounce {
    to {
        text-shadow: float-text-3d($floating: true);
        transform: translateY(-20px);
    }
}

.wrapper,
.content {
    position: relative;
    z-index: 1;
}

.wrapper {
    margin-top: 0;
}

.content {
    overflow-y: scroll;
    min-height: calc(100vh - $header-height) !important;

    &::-webkit-scrollbar {
        display: none;
    }

    scroll-snap-type: y mandatory;
}

.content .section {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    scroll-snap-align: center;
    scroll-snap-stop: always !important;

    .img {
        width: 100%;
        height: 100%;
    }

    .video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.content .section.explore {
    position: relative;

    .text-3d {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translateY(-50%);
        font-size: 3rem;
        /* 文字大小 */
        font-weight: bold;
        text-transform: uppercase;
        background-clip: text;
        -webkit-background-clip: text;
        /* 将背景裁剪为文字形状 */
        -webkit-text-fill-color: transparent;
        /* 使文字颜色透明，仅显示背景 */
        text-shadow:
            3px 3px 0px rgba(0, 0, 0, 0.25),
            6px 6px 0px rgba(0, 0, 0, 0.15);
        /* 3D 阴影效果 */

        background-color: hsla(0, 51%, 63%, 1);
        background-image: radial-gradient(at 40% 20%, hsla(27, 78%, 15%, 1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(189, 80%, 27%, 1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsla(340, 11%, 6%, 1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsla(240, 67%, 44%, 1) 0px, transparent 50%),
            radial-gradient(at 0% 0%, hsla(343, 39%, 11%, 1) 0px, transparent 50%);
    }

    .bottom {
        top: 60%;
        left: 30%;
    }


    @media screen and (max-width:768px) {
        .text-3d {
            font-size: 1rem;
        }

    }
}



.main {
    background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
    height: 100%;
    color: white;
    text-align: center;
    padding: 50px 20px;
    border-radius: 8px;
    scroll-snap-align: center;
    scroll-snap-stop: always;

    .gradient-title {
        display: flex;
        background: linear-gradient(to right, #ff6f61, #413a14, #09376b);
        color: white;
        font-size: 3em;
        justify-content: center;
        font-weight: bold;
        margin-bottom: 0.5em;
        text-transform: uppercase;
    }

    .sub-title {
        font-size: 2em;
        color: #ff6f61; // 为副标题设置一个与主标题渐变色搭配的颜色
        margin-bottom: 1.5em;
        font-weight: lighter; // 设置副标题的字重为较轻，突出主标题
        text-transform: uppercase;
        text-shadow: float-text-3d($floating: false);
    }

    p {
        font-size: 1.2em;
        max-width: 600px;
        margin: 0 auto 1.5em;
        text-align: left; // 让段落内容从左对齐
    }

    // 定义按钮的样式
    .btn {
        display: inline-block;
        padding: 10px 20px;
        color: #fff;
        background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
        text-decoration: none;
        border-radius: 5px;
        transition: background 0.3s;
        z-index: 999;

        &:hover {
            background-color: linear-gradient(-60deg, #b98383 0%, #b87a25 100%);
        }
    }
}

.image-container {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    perspective: 500px;
    overflow: hidden;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
}

/* 移动端样式调整 */
@media (max-width: 768px) {
    .wrapper {
        margin-top: 0 !important;
    }

    .content {
        overflow-y: auto !important;
    }

    .content .section {
        width: 100vw;
        // border: 1px solid #dda1a1;
        // 渐变色背景
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));

        img {
            object-fit: contain;
            width: 100%;
        }

        video {
            object-fit: cover;
            height: 100vh;
            width: 100vw;
        }
    }

    .gradient-title {
        span {
            font-size: 2rem !important;
        }
    }

    /* 视频的 object-fit 调整为 contain，确保不会裁剪 */

    /* 缩小图片，适应手机屏幕 */
    .image-container {
        position: absolute;
        max-height: 30vh;
        z-index: 9;
    }

    .image-container img {
        scale: 1;
    }
}

$glass-background: rgba(255, 255, 255, 0.8);
$glass-border-color: #ccc;
$shadow-color: rgba(0, 0, 0, 0.3);
$crack-color: rgba(0, 0, 0, 0.2);
$crack-shadow: rgba(0, 0, 0, 0.4);

.glass {
    position: relative;
    width: 100%;
    height: 100%;
    //   background: $glass-background;
    border: 2px solid $glass-border-color;
    border-radius: 10px;
    box-shadow:
        inset 0 0 10px $shadow-color,
        0 0 15px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    z-index: 1;

    // 破碎效果背景
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.5);
        clip-path: polygon(0% 0%, 50% 10%, 100% 0%, 90% 50%, 100% 100%, 50% 90%, 0% 100%, 10% 50%);
        box-shadow: inset 0 0 15px $crack-shadow;
        z-index: -1; // 使其在内容底部
    }

    // 裂缝效果
    .crack {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 100%;
        background: $crack-color;
        transform-origin: center center;
        box-shadow: 5px 5px 15px $crack-shadow;
        animation: crack 0.3s infinite alternate;

        &:nth-child(2) {
            transform: rotate(-45deg);
            animation-delay: 0.15s;
        }
    }

    // 动画效果
    @keyframes crack {
        0% {
            opacity: 1;
            transform: scale(1) rotate(45deg);
        }

        100% {
            opacity: 0.6;
            transform: scale(1.1) rotate(45deg);
        }
    }
}

.btn {
    --hue: 190;
    --ease-in-duration: 0.25s;
    --ease-in-exponential: cubic-bezier(0.95, 0.05, 0.795, 0.035);
    --ease-out-duration: 0.65s;
    --ease-out-delay: var(--ease-in-duration);
    --ease-out-exponential: cubic-bezier(0.19, 1, 0.22, 1);
    position: relative;
    padding: 1rem 3rem;
    font-size: 1rem;
    line-height: 1.5;
    color: white;
    text-decoration: none;
    background-color: hsl(var(--hue), 100%, 41%);
    border: 1px solid hsl(var(--hue), 100%, 41%);
    outline: transparent;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transition: 0.25s;

    &:hover {
        background: hsl(var(--hue), 100%, 31%);
    }

    &-primary {
        --hue: 171;
    }

    &-ghost {
        color: hsl(var(--hue), 100%, 41%);
        background-color: transparent;
        border-color: hsl(var(--hue), 100%, 41%);

        &:hover {
            color: white;
        }
    }

    &-border-stroke {
        border-color: hsla(var(--hue), 100%, 41%, 0.35);

        .btn-borders {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            .border-top {
                position: absolute;
                top: 0;
                width: 100%;
                height: 1px;
                background: hsl(var(--hue), 100%, 41%);
                transform: scaleX(0);
                transform-origin: left;
            }

            .border-right {
                position: absolute;
                right: 0;
                width: 1px;
                height: 100%;
                background: hsl(var(--hue), 100%, 41%);
                transform: scaleY(0);
                transform-origin: bottom;
            }

            .border-bottom {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 1px;
                background: hsl(var(--hue), 100%, 41%);
                transform: scaleX(0);
                transform-origin: left;
            }

            .border-left {
                position: absolute;
                left: 0;
                width: 1px;
                height: 100%;
                background: hsl(var(--hue), 100%, 41%);
                transform: scaleY(0);
                transform-origin: bottom;
            }

            // when unhover, ease-out left, bottom; ease-in right, top

            .border-left {
                transition: var(--ease-out-duration) var(--ease-out-delay) var(--ease-out-exponential);
            }

            .border-bottom {
                transition: var(--ease-out-duration) var(--ease-out-delay) var(--ease-out-exponential);
            }

            .border-right {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
            }

            .border-top {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
            }
        }

        &:hover {
            color: hsl(var(--hue), 100%, 41%);
            background: transparent;

            .border-top,
            .border-bottom {
                transform: scaleX(1);
            }

            .border-left,
            .border-right {
                transform: scaleY(1);
            }

            // when hover, ease-in left, bottom; ease-out right, top

            .border-left {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
            }

            .border-bottom {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
            }

            .border-right {
                transition: var(--ease-out-duration) var(--ease-out-delay) var(--ease-out-exponential);
            }

            .border-top {
                transition: var(--ease-out-duration) var(--ease-out-delay) var(--ease-out-exponential);
            }
        }
    }

    &-text-float-up {
        &::after {
            position: absolute;
            content: attr(data-text);
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transform: translateY(35%);
            transition: 0.25s ease-out;
        }

        // when hover, ease-in top-text; ease-out bottom-text

        .btn-text {
            display: block;
            transition: 0.75s 0.1s var(--ease-out-exponential);
        }

        &:hover {
            // when hover, ease-in bottom-text; ease-out top-text

            .btn-text {
                opacity: 0;
                transform: translateY(-25%);
                transition: 0.25s ease-out;
            }

            &::after {
                opacity: 1;
                transform: translateY(0);
                transition: 0.75s 0.1s var(--ease-out-exponential);
            }
        }
    }
}

.landIn {
    display: flex;
    flex-wrap: wrap;
    line-height: 1.8;
    color: white;
    font-family: Lora, serif;
    white-space: pre;

    span {
        animation: landIn 0.8s ease-out both;
    }
}

@keyframes landIn {
    from {
        opacity: 0;
        transform: translateY(-20%);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dbounce-span {
    text-shadow: float-text-3d($floating: false);
    animation: dbounce 0.3s ease infinite alternate;
}

.btn-border {
    z-index: 9999;
}
</style>
