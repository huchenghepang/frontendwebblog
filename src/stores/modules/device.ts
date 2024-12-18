import { getHorizontalScrollbarHeight, getScrollbarWidth, hasScrollbar } from '@/utils/device/device';
import { defineStore } from 'pinia';
import { ref, computed, onMounted, onUnmounted } from 'vue';

export const useDeviceStore = defineStore('device', () => {
    // 设备屏幕宽度和高度
    const screenWidth = ref(window.innerWidth || document.documentElement.clientWidth);
    const screenHeight = ref(window.innerHeight || document.documentElement.clientHeight);
  
    // 滚动条宽度
    const scrollbarWidth = ref(getScrollbarWidth());

    // 监听设备的缩放比例
    const devicePixelRatio = ref(window.devicePixelRatio);

    // 设备类型
    const deviceType= computed<'desktop' | 'mobile' | 'tablet'>(() => {
        if (screenWidth.value < 768) return 'mobile';
        if (screenWidth.value < 1200) return 'tablet';
        return 'desktop';
    });

    // 判断是否为大屏设备
    const isLargeScreen = computed(() => screenWidth.value >= 1200);

    // 减少滚动条相关计算的频率
    const updateScrollbar = () => {
        const { hasVerticalScrollbar } = hasScrollbar(); 
        if (hasVerticalScrollbar) {
            screenWidth.value -= scrollbarWidth.value;            
        }
    };

    // 监听屏幕大小和缩放变化的事件处理器
    const updateDeviceInfo = () => {
    // 使用防抖来减少事件触发频率
        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;

        // 当屏幕尺寸变化时更新数据
        if (width !== screenWidth.value || height !== screenHeight.value) {
            screenWidth.value = width;
            screenHeight.value = height;
            devicePixelRatio.value = window.devicePixelRatio;
            scrollbarWidth.value = getScrollbarWidth();
            updateScrollbar();
        }
    };

    // 使用防抖（debounce）优化 resize 事件
    let resizeTimeout:number;
    const debounceResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateDeviceInfo, 200); // 延迟200ms执行
    };

    // 在组件挂载时添加事件监听
    onMounted(() => {
        window.addEventListener('resize', debounceResize);
    });

    // 在组件卸载时移除事件监听
    onUnmounted(() => {
        window.removeEventListener('resize', debounceResize);
        clearTimeout(resizeTimeout); // 清除防抖定时器
    });

    return {
        screenWidth,
        screenHeight,
        devicePixelRatio,
        deviceType,
        isLargeScreen,
        scrollbarWidth
    };
});
