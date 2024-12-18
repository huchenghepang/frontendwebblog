// src/directives/swipe.ts
import type { DirectiveBinding } from 'vue';

interface SwipeBindingValue {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  isGlobal?: boolean;
  threshold?: number;
}

class SwipeElement extends HTMLElement {
    _removeSwipeListeners?: () => void;
}

const swipeDirective = {
    mounted(el: SwipeElement, binding: DirectiveBinding<SwipeBindingValue>) {



        let startX = 0;
        let endX = 0;
        const threshold = binding.value?.threshold || 30; // 默认滑动触发阈值

        // 触摸开始事件处理函数
        const handleTouchStart = (event: TouchEvent) => {
            startX = event.touches[0].clientX;
        };

        // 触摸结束事件处理函数
        const handleTouchEnd = (event: TouchEvent) => {
            endX = event.changedTouches[0].clientX;
            detectSwipe();
        };

        // 检测滑动方向
        const detectSwipe = () => {
            const distance = endX - startX;
            if (Math.abs(distance) > threshold) {
                if (distance > 0) {
                    binding.value?.onSwipeRight?.(); // 触发右滑回调

                } else {
                    binding.value?.onSwipeLeft?.(); // 触发左滑回调
                }
            }
        };

        // 绑定触摸事件监听
        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchend', handleTouchEnd, { passive: true });

        if (binding.value?.isGlobal) {
            document.addEventListener('touchstart', handleTouchStart, { passive: true });
            document.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
        // 存储事件清理函数，供 unmounted 时调用
        el._removeSwipeListeners = () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
            if (binding.value?.isGlobal) {
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchend', handleTouchEnd);
            }
        };
    },
    unmounted(el: SwipeElement) {
        // 移除事件监听
        if(el._removeSwipeListeners){
            el._removeSwipeListeners();
        }
    }
};

export default swipeDirective;
