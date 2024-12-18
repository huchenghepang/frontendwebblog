<template>
    <Transition name="slide-fade">
        <div class="my-message" :style="style[type]" v-show="message.isShow">
            <span class="text">{{ text }}</span>
        </div>
    </Transition>
</template>
<script>
import { onMounted, reactive } from 'vue'
export default {
    name: 'myMessage',
    props: {
        text: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            // warn 警告  error 错误  success 成功
            default: 'warn'
        },
        duration: {
            type: Number,
            default: 3000
        }
    },
    setup(props) {
        // 定义一个对象，包含三种情况的样式，对象key就是类型字符串
        const style = {
            warn: {
                icon: 'icon-warning',
                color: '#E6A23C',
                backgroundColor: 'rgb(253, 246, 236)',
                borderColor: 'rgb(250, 236, 216)'
            },
            error: {
                icon: 'icon-shanchu',
                color: '#F56C6C',
                backgroundColor: 'rgb(254, 240, 240)',
                borderColor: 'rgb(253, 226, 226)'
            },
            success: {
                icon: 'icon-queren2',
                color: '#67C23A',
                backgroundColor: 'rgb(240, 249, 235)',
                borderColor: 'rgb(225, 243, 216)'
            }
        }
        const message = reactive({
            // 列数
            isShow: false
        })
        // 控制动画
        // const isShow = ref(false)
        // 组件模板渲染成功后触发
        onMounted(() => {
            message.isShow = true
            setTimeout(() => {
                message.isShow = false
            }, props.duration)
        })
        return { style, message }
    }
}
</script>
<style lang="scss">
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

.my-message-container {
    position: fixed !important;
    top: 20px;
    // left: 50%;
    width: 100%;
    display: flex;
    /* 设置为弹性容器 */
    flex-direction: column;
    /* 纵向排列子元素 */
    align-items: stretch;
    /* 子元素宽度自适应 */
    position: relative;
    /* 父元素设置为相对定位 */
    z-index: 9999;
}

.my-message {
    z-index: 99999 !important;
    margin: 5px auto;
    max-width: 30%;
    line-height: 30px;
    padding: 0 25px;
    border: 1px solid #e4e4e4;
    mix-blend-mode: difference;
    color: #999;
    border-radius: 4px;

    i {
        margin-right: 4px;
        vertical-align: middle;
    }

    .text {
        vertical-align: auto;
        text-align: center;
    }
}
</style>
