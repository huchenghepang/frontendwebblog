/**
 * 获取滚动条的宽度
 * @returns 滚动条的宽度（像素）
 */
export function getScrollbarWidth(): number {
    // 创建一个临时的 div 元素
    const div = document.createElement('div');

    // 设置 div 的样式
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.overflow = 'scroll'; // 强制显示滚动条
    div.style.position = 'absolute';
    div.style.top = '-9999px';  // 将其移出视口

    // 将 div 添加到文档中
    document.body.appendChild(div);

    // 获取滚动条的宽度
    const scrollbarWidth = div.offsetWidth - div.clientWidth;

    // 删除临时 div 元素
    document.body.removeChild(div);
    return scrollbarWidth;
}

/**
 * 获取水平滚动条的高度
 * @returns 水平滚动条的高度（像素）
 */
export function getHorizontalScrollbarHeight(): number {
    // 创建一个临时的 div 元素
    const div = document.createElement('div');

    // 设置 div 的样式
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.overflowX = 'scroll'; // 强制显示水平滚动条
    div.style.position = 'absolute';
    div.style.top = '-9999px';  // 将其移出视口

    // 将 div 添加到文档中
    document.body.appendChild(div);

    // 获取水平滚动条的高度
    const scrollbarHeight = div.offsetHeight - div.clientHeight;

    // 删除临时 div 元素
    document.body.removeChild(div);
    return scrollbarHeight;
}



/**
* 判断页面或元素是否有滚动条
* @param {HTMLElement | null} element - 可选，指定元素。如果未传入，则默认判断整个文档。
* @returns {object} 包含是否有垂直和水平滚动条的对象
*/
export function hasScrollbar(element: HTMLElement | null = null): { hasVerticalScrollbar: boolean, hasHorizontalScrollbar: boolean } {
    // 如果没有传入元素，则默认使用 document.documentElement
    const targetElement = element || document.documentElement;

    // 判断垂直滚动条：scrollHeight > clientHeight
    const hasVerticalScrollbar = targetElement.scrollHeight > targetElement.clientHeight;

    // 判断水平滚动条：scrollWidth > clientWidth
    const hasHorizontalScrollbar = targetElement.scrollWidth > targetElement.clientWidth;

    return { hasVerticalScrollbar, hasHorizontalScrollbar };
}

