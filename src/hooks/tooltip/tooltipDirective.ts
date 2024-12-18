import type { DirectiveBinding } from 'vue'; // 仅类型导入


// 自定义一个ToolTipElement类，继承 HTMLElement
class ToolTipElement extends HTMLElement {
    // 添加一个新属性 `_vTipCleanup`
    _vTipCleanup?: () => void;

    constructor() {
        super(); // 调用父类的构造函数
    }

    // 可以在构造函数中设置默认的行为
    initTooltip() {
        this.addEventListener('mouseenter', this.showTooltip);
        this.addEventListener('mouseleave', this.hideTooltip);
    }

    // 显示提示的事件处理函数
    private showTooltip() {
        console.log('Tooltip shown');
    }

    // 隐藏提示的事件处理函数
    private hideTooltip() {
        console.log('Tooltip hidden');
    }

    // 覆盖父类的 `connectedCallback` 方法，用来初始化事件
    connectedCallback() {
        this.initTooltip();
        this._vTipCleanup = () => {
            this.removeEventListener('mouseenter', this.showTooltip);
            this.removeEventListener('mouseleave', this.hideTooltip);
        };
    }
}

const vTip = {
    // 创建共享的 Shadow DOM 容器
    sharedTooltip: null as HTMLElement | null,

    createSharedTooltip() {
        if (!this.sharedTooltip) {
            // 创建承载 tooltip 的 div
            const tooltipContainer = document.createElement('div');
            tooltipContainer.style.position = 'absolute';
            tooltipContainer.style.display = 'none'; // 初始为隐藏
            tooltipContainer.style.backgroundColor = "#fafafa";
            tooltipContainer.style.color = '#007BFF';
            tooltipContainer.style.padding = '5px 10px';
            tooltipContainer.style.borderRadius = '4px';
            tooltipContainer.style.zIndex = '99999';
            tooltipContainer.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';

            // 创建一个 shadow root
            const shadowRoot = tooltipContainer.attachShadow({ mode: 'open' });

            // 在 shadow root 中创建实际的内容元素
            const content = document.createElement('span');
            content.className = 'tooltip-content';
            shadowRoot.appendChild(content);

            // 将共享的 tooltip 放入文档中
            document.body.appendChild(tooltipContainer);
            this.sharedTooltip = tooltipContainer;
        }
        return this.sharedTooltip;
    },

    beforeMount(el: ToolTipElement, binding: DirectiveBinding) {
        const tooltip = vTip.createSharedTooltip();
        const content = tooltip.shadowRoot!.querySelector('.tooltip-content') as HTMLElement;

        const updatePosition = () => {
            const rect = el.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = rect.bottom + window.scrollY + 10;
            let left = rect.left + window.scrollX + (rect.width - tooltipRect.width) / 2;

            if (top + tooltipRect.height > viewportHeight + window.scrollY) {
                top = rect.top + window.scrollY - tooltipRect.height - 10;
            }

            if (left < 0) {
                left = 10;
            }

            if (left + tooltipRect.width > viewportWidth + window.scrollX) {
                left = viewportWidth + window.scrollX - tooltipRect.width - 10;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        };

        const showTooltip = () => {
            content.innerText = binding.value; // 设置 tooltip 的内容
            tooltip.style.display = 'block'; // 显示 tooltip
            updatePosition();
        };

        const hideTooltip = () => {
            tooltip.style.display = 'none'; // 隐藏 tooltip
        };

        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);

        el._vTipCleanup = () => {
            el.removeEventListener('mouseenter', showTooltip);
            el.removeEventListener('mouseleave', hideTooltip);
        };
    },

    unmounted(el: ToolTipElement) {
        if (el._vTipCleanup) {
            el._vTipCleanup();
        }
    },
};

export default vTip;

