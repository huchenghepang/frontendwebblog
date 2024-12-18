<template>
    <div class="float-button-group">
        <button @click="toggleButtons" class="main-button">
            {{ showButtons ? '关闭' : '展开' }}
        </button>
        <Transition name="list">
            <div v-if="showButtons" class="button-group">
                <template v-for="(node, index) in processedSlotNodes" :key="index">
                    <component :is="node.type" v-bind="node.props">
                        <!-- 递归渲染子节点 -->
                        <template v-if="node.children">
                            <span v-if="typeof node.children === 'string' || typeof node.children === 'number'">
                                {{ node.children }}
                            </span>
                            <template v-else>
                                <RenderChildren :children="node.children" />
                            </template>
                        </template>
                    </component>
                </template>

                <!-- 遍历插槽内容并渲染 -->
            </div>
        </Transition>
    </div>
</template>

<script setup name='FloatButtonGroup' lang='ts'>
import { ref, computed, h } from 'vue'
import { useSlots } from 'vue'

// 控制子按钮显示/隐藏的状态
const showButtons = ref(false)

// 切换按钮显示状态
const toggleButtons = () => {
    showButtons.value = !showButtons.value
}

// 获取插槽内容
const slots = useSlots()
const processedSlotNodes = computed(() => {
    if (slots.default) {
        // 处理插槽内容，仅在第一层添加 sub-button 类
        return slots.default().map((vnode) => {
            if (vnode.type && typeof vnode.type !== 'symbol') {
                const props = vnode.props || {}
                return {
                    ...vnode,
                    props: {
                        ...props,
                        class: ['sub-button', props.class].filter(Boolean).join(' ')
                    },
                    children: vnode.children
                }
            }
            return vnode // 保持其他节点不变
        })
    }
    return []
})
// 组件：递归渲染子节点
const RenderChildren = {
    props: {
        children: {
            type: [Array, Object, String, Number],
            default: () => []
        }
    },
    setup(props) {
        return () => {
            if (typeof props.children === 'string' || typeof props.children === 'number') {
                // 如果是文本或数字，直接渲染
                return props.children
            } else if (Array.isArray(props.children)) {
                // 如果是数组，递归渲染每一个子节点
                return props.children.map((child, index) => {
                    return h(
                        child.type,
                        { ...child.props, key: index },
                        child.children ? () => h(RenderChildren, { children: child.children }) : null
                    )
                })
            } else if (props.children && typeof props.children === 'object') {
                // 如果是单一节点对象，渲染节点
                return h(
                    props.children.type,
                    { ...props.children.props },
                    props.children.children ? () => h(RenderChildren, { children: props.children.children }) : null
                )
            }
            return null
        }
    }
}
</script>

<style scoped>
.float-button-group {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
}

.main-button {
    background-color: #3498db;
    color: white;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
}

.button-group {
    margin-top: 10px;
}

.sub-button {
    background-color: transparent;
    color: white;
    border: none;
    margin: 5px 0;
    padding: 10px 15px;
    border-radius: 20px;
    cursor: pointer;
}

/* 过渡动画组 */
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
    position: absolute;
}
</style>
