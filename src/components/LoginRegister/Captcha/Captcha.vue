<template>
    <div class="captcha-container clearfix">
        <div class="captcha-content clearfix">
            <input
                type="text"
                :value="modelValue"
                maxlength="4"
                placeholder="验证码"
                class="captcha-input"
                @input="onInput"
            >
            <SvgRender
                :svg-data="svgData"
                class="captcha-image"
            />
            <button
                class="captcha-refresh-btn"
                @click="refreshCaptcha"
            >
                刷新验证码
            </button>
        </div>
    </div>
</template>
<script setup name="Captcha">
import { reqCaptcha } from '@/api/user'
import { onMounted, ref } from 'vue'
import SvgRender from './SvgRender/SvgRender.vue'

// 存储验证码输入框的值
const props = defineProps({
    modelValue: String
});
const emits = defineEmits(['update:modelValue']);
const onInput = (e) => {
    emits('update:modelValue', e.target.value);
};
const svgData = ref(`<svg t="1731620066429" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5284" width="200" height="200"><path d="M492.544 414.208C471.04 291.84 552.96 174.592 675.328 153.088s239.616 60.416 261.12 182.784c21.504 122.368-60.416 239.616-182.784 261.12s-239.616-60.416-261.12-182.784z m100.864-17.92c11.776 67.072 75.776 111.616 142.336 99.84 67.072-11.776 111.616-75.776 99.84-142.336-11.776-67.072-75.776-111.616-142.336-99.84-66.56 11.776-111.616 75.776-99.84 142.336z" p-id="5285"></path><path d="M225.28 862.72l364.544-306.176c31.232-26.112 50.688-57.856 24.576-89.088-26.112-31.232-73.216-35.328-104.448-9.216l-364.544 306.176c-31.232 26.112-45.568 62.976-19.456 94.208 26.112 31.232 67.584 30.208 99.328 4.096z" p-id="5286"></path><path d="M240.64 774.144l79.36-63.488c8.704-7.168 9.728-20.48 2.56-28.672L222.72 563.2c-7.168-8.704-20.48-9.728-28.672-2.56l-79.36 63.488c-8.704 7.168-9.728 20.48-2.56 28.672l99.328 118.784c7.68 8.704 20.48 9.728 29.184 2.56z" p-id="5287"></path></svg>`)
// 刷新验证码的函数
const refreshCaptcha = async () => {
    try {
        const result = await reqCaptcha()
        if(result){
            svgData.value = result;
        }
    } catch (error) {}
}

onMounted(() => {
    refreshCaptcha()
})
</script>

<style scoped lang="scss">
/* 验证码容器整体样式 */
.captcha-container {
    width: 100%;
}

/* 容器内内容区域样式 */
.captcha-content {
    display: flex;
    justify-content: space-between;
}

/* 验证码输入框样式 */
.captcha-input {
    width: 25%;
    padding: 5px;
    font-size: 12px;
    border: 1px solid transparent;
    outline: none;
}

/* 验证码图片样式 */
.captcha-image {
    width: 65%;
    height: 3rem;
    border-radius: 5px;
    line-height: 100%;
    display: flex;
    align-items: center;
    &:deep() {
        svg {
            width: 100%;
            height: 100%;
        }
    }
}

/* 刷新验证码按钮样式 */
.captcha-refresh-btn {
    padding: 3px 5px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    background-color: #2972c0;
    color: white;
    cursor: pointer;
}

.captcha-refresh-btn:hover {
    background-color: #0056b3;
}
</style>
