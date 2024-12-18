<template>
    <div v-swipe="bingEvent" :class="['table-of-contents', { 'is-hidden': isHidden }]">
        <nav class="toc-content">
            <h2 class="toc-title" style="font-size: 1.5rem;font-weight: bold;">
                文章目录:
            </h2>
            <ul>
                <li v-for="(item, index) in toc" :key="item.id" :style="`{ paddingLeft: ${item.level * 10}px }`">
                    <template v-if="item.title">
                        <div :class="['toc-item', { active: activeId === item.id }]"
                            @click="navigate(item.id, item.level)">
                            <span class="item-title">{{ item.title }}</span>
                            <span v-if="item.children && item.children.length" class="toggle-icon"
                                @click.stop="toggle(item)">
                                <!-- {{ item.isOpen ? '▼' : '►' }} -->
                                <el-icon v-if="item.isOpen">
                                    <ArrowDown />   
                                </el-icon>
                                <el-icon v-else>
                                    <ArrowRight />
                                </el-icon>
                            </span>
                        </div>
                    </template>

                    <transition name="fade">
                        <ul v-if="item.isOpen" class="nested-list">
                            <li v-for="(child, childIndex) in item.children" :key="child.id"
                                :style="{ paddingLeft: '20px' }">
                                <template v-if="child.title">
                                    <div :class="['toc-item', { active: active2Id === child.id }]"
                                        @click="navigate(child.id, child.level)">
                                        <span class="item-title">{{ child.title }}</span>
                                        <span v-if="child.children && child.children.length" class="toggle-icon"
                                            @click.stop="toggle(child)">
                                            <!-- {{  child.isOpen? '▼' : '►' }} -->
                                            <el-icon v-if="child.isOpen">
                                                <ArrowDown />
                                            </el-icon>
                                            <el-icon v-else>
                                                <ArrowRight />
                                            </el-icon>
                                        </span>
                                    </div>
                                </template>
                                <transition name="fade">
                                    <ul v-if="child.isOpen" class="nested-list">
                                        <li v-for="(subChild, subChildIndex) in child.children" :key="subChild.id"
                                            :style="{ paddingLeft: '10px' }"
                                            @click="navigate(subChild.id, subChild.level)">
                                            <span class="sub-item" :class="{ active: active3Id === subChild.id }">{{
                                                subChild.title
                                                }}</span>
                                        </li>
                                    </ul>
                                </transition>
                            </li>
                        </ul>
                    </transition>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
    import emitter from '@/utils/mitt'
    import { ref, defineProps, onMounted, watch, watchEffect, nextTick, onUnmounted } from 'vue'
    const props = defineProps({
        toc: {
            type: Array,
            required: true
        }
    })

    const activeId = ref(null) // 记录当前激活的文章 id
    // 记录激活二级标题的id
    const active2Id = ref(null)
    // 三级标题
    const active3Id = ref(null)

    const isHidden = ref(false) // 控制目录的显示与隐藏
    const startX = ref(0) // 触摸起始位置

    // 一级展开项数量 计算属性
    let firstExpendItem = ref(0) //
    watchEffect(() => {
        if (props.toc.length === 0) return 0
        // 累加器 遍历toc
        const count = props.toc.reduce((accumulator, item, index, array) => {
            if (item && item.isOpen === true) {
                return accumulator + 1
            }
            return accumulator
        }, 0)
        firstExpendItem.value = count
    })

    // 监控屏幕滚动
    let isScrolling = false
    let scrollTimer = null

    function toggle(item) {
        item.isOpen = !item.isOpen // 切换子项的展开状态
    }

    function toggleVisibility() {
        isHidden.value = !isHidden.value // 切换目录的显示状态
    }

    function navigate(id, level) {
        const element = document.getElementById(id)
        clearTimeout(scrollTimer)
        isScrolling = true
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            switch (level) {
                case 1:
                    activeId.value = id // 点击时立即设置高亮
                    active2Id.value = null
                    active3Id.value = null
                    break
                case 2:
                    activeId.value = null // 点击时立即设置高亮
                    active2Id.value = id
                    active3Id.value = null
                    break
                case 3:
                    activeId.value = null // 点击时立即设置高亮
                    active2Id.value = null
                    active3Id.value = id
                    break
                default:
                    break
            }
        }

        scrollTimer = setTimeout(() => {
            isScrolling = false
        }, 1000)
    }

    let observer = undefined
    const observeHeaders = () => {
        activeId.value = null
        active2Id.value = null
        active3Id.value = null
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (isScrolling) {
                            return
                        }
                        // entry是否是一级标题 如果不是 那么就不进行高亮
                        if (entry.target.tagName === 'H1') {
                            activeId.value = entry.target.id // 高亮当前标题
                        } else if (entry.target.tagName === 'H2') {
                            /* 找到其上一级的标题的ID */

                            const parentToc = props.toc.find((item) => {
                                const isExist = item.children.some((child) => child.id === entry.target.id)
                                return isExist
                            })
                            const parentId = parentToc ? parentToc.id : null
                            activeId.value = parentId
                            // console.log(parentId)
                            // activeId.value = null; //
                            active2Id.value = entry.target.id // 高亮二级标题
                        } else if (entry.target.tagName === 'H3') {
                            /* 找到其上一级的H1和H2的ID */
                            // 这种计算非常消耗性能
                            const idInfo = {
                                grandParentId: null,
                                parentTocId: null
                            }
                            props.toc.forEach((item) => {
                                for (let i = 0; i < item.children.length; i++) {
                                    const isExist = item.children[i].children.some((child) => child.id === entry.target.id)
                                    if (isExist) {
                                        idInfo.grandParentId = item.id
                                        idInfo.parentTocId = item.children[i].id
                                        return
                                    }
                                }
                            })

                            // console.log(idInfo);
                            activeId.value = idInfo.grandParentId
                            active2Id.value = idInfo.parentTocId

                            // activeId.value = null; //
                            // active2Id.value = null; //
                            active3Id.value = entry.target.id // 三级标题
                        }
                    }
                })
            },
            {
                threshold: 1, // 50% 可见时触发
                rootMargin: '-40% 0px -40%' // 调整触发位置到视口中间
            }
        )
        props.toc.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) observer.observe(element)
            if (item.children && item.children.length > 0) {
                item.children.forEach((child) => {
                    const element = document.getElementById(child.id)

                    if (element) observer.observe(element)
                    if (child.children && child.children.length > 0) {
                        child.children.forEach((subChild) => {
                            const element = document.getElementById(subChild.id)
                            if (element) observer.observe(element)
                        })
                    }
                })
            }
        })
    }

    onUnmounted(() => {
        if (observer) {
            observer.disconnect()
            observer = undefined
        }
    })

    function handleSwipeLeft() {
        isHidden.value = true // 往左滑动隐藏目录
        emitter.emit('toggleShowBtn', false)
    }

    function handleSwipeRight() {
        isHidden.value = false // 往右滑动显示目录
        emitter.emit('toggleShowBtn', true)
    }

    const bingEvent = {
        onSwipeLeft: handleSwipeLeft,
        onSwipeRight: handleSwipeRight,
        isGlobal: true,
        threshold: 50 // 可选参数，滑动触发的距离阈值
    }

    watch(
        () => props.toc,
        () => {
            nextTick(() => {
                observeHeaders()
            })
        },
        {
            deep: true
        }
    )

    onMounted(() => {
        emitter.on('onShowHiddenDir', (data) => {
            isHidden.value = data
        })
    })

    onUnmounted(() => {
        emitter.off('onShowHiddenDir')
    })
</script>

<style scoped lang="scss">
    .table-of-contents {
        position: fixed;
        top: $header-height;
        left: 0;
        height: 100vh;
        width: 300px;
        // max-width: 500px;
        /* 背景颜色 */
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        transition: transform 0.3s ease;
        z-index: 1000;
        @include bg_sub_color();
        // 隐藏滚动条
        &::-webkit-scrollbar {
            display: none;
        }

        .toc-title{
            color: #007bff;
        }

        
    }

    .table-of-contents.is-hidden {
        transform: translateX(-100%);
        /* 隐藏目录 */
    }

    .toggle-button {
        position: absolute;
        top: 10px;
        right: -20px;
        /* 隐藏按钮的位置 */
        background: #007bff;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        transition: right 0.3s;
    }

    .toggle-button:hover {
        background-color: #0056b3;
        /* 悬停效果 */
    }

    .toc-content {
        padding: 20px 5px;
    }

    .toc-item {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding: 8px 12px;
        transition: background-color 0.2s;
        border-radius: 4px;
    }

    .toc-item:hover {
        background-color: #7baec5;
        /* 悬停时背景颜色 */
    }

    .item-title {
        flex-grow: 1;
        /* 自适应宽度 */
    }

    .toggle-icon {
        margin-left: 5px;
        /* 图标与文字间距 */
    }

    .nested-list {
        padding-left: 10px;
        /* 子项缩进 */
        margin-top: 5px;
        
        li {
            padding: 5px 2px;
            
        }
    }

    .sub-item {
        color: #333;
        text-decoration: none;
    }

    .sub-item:hover {
        text-decoration: underline;
        /* 悬停下划线效果 */
    }

    .fade-enter-active,
    .fade-leave-active {
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
        transform: translateY(10px);
    }

    .active {
        font-weight: bold;
        color: #567da7;
        /* 高亮样式 */
        text-decoration: underline;

        .item-title,
        &.sub-item {
            position: relative;

            &::before {
                position: absolute;
                content: '';
                display: block;
                width: 2px;
                height: 80%;
                background-color: #5b7280;
                left: -4px;
                margin: auto 0;
            }
        }
    }

    h1,
    h2,
    span {
        margin-bottom: 5px;
        padding-left: 3px;
        cursor: pointer;
    }

    /* 移动端样式 */
    @media (max-width: 768px) {
        .table-of-contents {
            width: 240px;
            /* 移动端宽度 */
            transition: transform 0.3s ease;
            .toc-content {}
        }
    }

    span{
        @include toc_ft_color();
    }
</style>
