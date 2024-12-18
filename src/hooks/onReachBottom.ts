import type { Directive, DirectiveBinding } from 'vue';

// 自定义给一个ScrollAbleHTMLELEMENT类
class scrollAbleHTMLELEMENT extends HTMLElement {
    // 添加一个新属性 `_vTipCleanup`
    _handleScroll?: () => void;

    constructor() {
        super(); // 调用父类的构造函数
    }
}

const onReachBottom: Directive = {
    mounted(el: scrollAbleHTMLELEMENT, binding: DirectiveBinding) {
        // 从指令绑定中获取距离底部触发的阈值（默认为0）
        const threshold: number = binding.arg ? parseInt(binding.arg as string) : 0;
        if (typeof binding.value !== 'function') {
            return
        }
        const handleScroll = () => {
            if (el.scrollTop + el.clientHeight + threshold >= el.scrollHeight) {
                // 如果绑定的值是函数，则执行该函数
                binding.value();
            }
        };

        el.addEventListener('scroll', handleScroll);
        // 将事件处理函数存储在元素上，以便在unmounted阶段移除
        el._handleScroll = handleScroll;
    },
    unmounted(el: scrollAbleHTMLELEMENT) {
        // 在组件卸载时移除滚动事件监听器
        const handleScroll = el._handleScroll;
        if (handleScroll) {
            el.removeEventListener('scroll', handleScroll);
        }
    }
};

export default onReachBottom;