export default function copyTextToClipboard(element: HTMLElement): boolean {
    // 获取元素的文本内容
    const text: string = element.textContent || element.innerText;

    if (!text) {
        console.warn('没有文本内容可复制');
        return false;
    }

    // 创建一个临时 textarea 元素
    const textArea: HTMLTextAreaElement = document.createElement('textarea');
    textArea.value = text;

    // 将 textarea 添加到文档中
    document.body.appendChild(textArea);

    // 选中 textarea 中的文本
    textArea.select();
    textArea.setSelectionRange(0, 99999); // 对于移动设备

    // 执行复制命令
    document.execCommand('copy');

    // 移除临时 textarea
    document.body.removeChild(textArea);

    // 可选：返回一个成功的提示
    return true;
}
