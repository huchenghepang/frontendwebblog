const observerMap = new WeakMap();

import type { DirectiveBinding } from 'vue';

// 创建 IntersectionObserver 实例
const createObserver = (callback: IntersectionObserverCallback, options: IntersectionObserverInit) => {
    return new IntersectionObserver(callback, options);
};

// 防抖函数（可以替换成节流函数，根据需求）
type DebounceFunction = (...args: any[]) => void;

function debounce<T extends DebounceFunction>(func: T, wait: number): T {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>): void {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    } as T;
}


const vAddClassOnVisible = {
    mounted(el: HTMLElement, binding: DirectiveBinding<[string, number, boolean]>) {
        const [className, offset, addOnce = false] = binding.value;

        if (!className || typeof className !== 'string') {
            console.warn('v-add-class-on-visible 需要一个字符串类型的类名作为第一个参数');
            return;
        }

        const triggerOffset = typeof offset === 'number' ? offset : 0; // 默认触发偏移为 0
        let isClassAdded = false; // 用于记录类名是否已经添加

        // 配置 IntersectionObserver 的 rootMargin 和 threshold
        const options: IntersectionObserverInit = {
            rootMargin: `0px 0px -${triggerOffset}px 0px`, // 视口偏移
            threshold: 0.5, // 仅当元素一半进入视口时
        };

        // 如果 observer 已经存在，直接使用它
        let observer = observerMap.get(el);

        if (!observer) {
            // 如果没有创建过 observer，则创建新的 observer
            observer = createObserver(debounce((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
                for (const entry of entries) {
                    // 元素完全进入视口时，添加类名
                    if (entry.isIntersecting) {
                        if (!isClassAdded) {
                            el.classList.add(className);
                            isClassAdded = true;

                            // 如果 addOnce 为 true，停止观察
                            if (addOnce) {
                                observer.unobserve(el);
                            }
                        }
                    } else if (!entry.isIntersecting) {
                        if (isClassAdded === true) {
                            el.classList.remove(className);
                            isClassAdded = false;
                        }
                    }
                }
            }, 100), options); // 节流100ms（可根据需要调整）

            // 保存 observer 到 map，以便 later 清理
            observerMap.set(el, observer);
            observer.observe(el);
        }
    },

    unmounted(el: HTMLElement) {
        const observer = observerMap.get(el);
        if (observer) {
            observer.unobserve(el); // 清理观察
            observerMap.delete(el); // 删除 observer 数据
        }
    },
};

export default vAddClassOnVisible;
