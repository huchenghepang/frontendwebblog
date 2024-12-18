const applyDampingEffect = (container: HTMLElement) => {
    let isScrolling = false;
    let lastScrollTop = 0;
    const dampingFactor = 0.1; // 阻尼系数，调整滚动速度

    const scrollHandler = () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                // 获取当前滚动位置
                const currentScrollTop = container.scrollTop;
                const delta = currentScrollTop - lastScrollTop; // 滚动的距离差

                // 应用阻尼效果，减慢滚动
                if (Math.abs(delta) > 0.1) {
                    container.scrollTop -= delta * dampingFactor;
                }

                // 更新最后的滚动位置
                lastScrollTop = container.scrollTop;

                isScrolling = false;
            });
            isScrolling = true;
        }
    };

    // 监听滚动事件
    container.addEventListener('scroll', scrollHandler, { passive: true });
};

const container = document.querySelector('.scroll-container') as HTMLElement;
if (container) {
    applyDampingEffect(container);
}


export default applyDampingEffect