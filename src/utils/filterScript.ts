/**
 * 过滤 HTML 字符串中的所有 <script> 标签
 * @param htmlString - 需要过滤的 HTML 字符串
 * @returns 过滤后的字符串
 */
export function filterScript(htmlString: string): string {
    // 使用正则表达式来匹配并移除 <script> 标签及其内容
    return htmlString.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}

/**
 * 过滤 HTML 字符串中的所有以 "on" 开头的事件属性
 * @param htmlString - 需要过滤的 HTML 字符串
 * @returns 过滤后的字符串
 */
export function filterEventAttributes(htmlString: string): string {
    // 匹配所有以 "on" 开头的属性并移除
    return htmlString.replace(/\s*on\w+="[^"]*"/gi, '')
        .replace(/\s*on\w+='\w*'/gi, '');
}