

 export interface ElementInfo {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  offsetTop: number;
  offsetLeft: number;
  borderWidth: number;
  borderHeight: number;
  clientWidth: number;
  clientHeight: number;
  offsetWidth: number;
}



/**
 * 获取元素的几何信息，包括宽高、位置、边框和内容区大小等。
 * @param element 需要获取几何信息的DOM元素
 * @returns {Object} 返回元素的几何信息对象，包括以下属性：
 * - width: {number} 元素的宽度（单位为像素）
 * - height: {number} 元素的高度（单位为像素）
 * - top: {number} 元素相对于视口顶部的距离（单位为像素）
 * - left: {number} 元素相对于视口左侧的距离（单位为像素）
 * - bottom: {number} 元素相对于视口底部的距离（单位为像素）
 * - right: {number} 元素相对于视口右侧的距离（单位为像素）
 * - offsetTop: {number} 元素相对于整个文档顶部的距离（单位为像素）
 * - offsetLeft: {number} 元素相对于整个文档左侧的距离（单位为像素）
 * - borderWidth: {number} 元素边框的总宽度（左右两侧相加，单位为像素）
 * - borderHeight: {number} 元素边框的总高度（上下两侧相加，单位为像素）
 * - clientWidth: {number} 元素内容区的宽度（单位为像素，包含内边距但不包含边框）
 * - clientHeight: {number} 元素内容区的高度（单位为像素，包含内边距但不包含边框）
 * - offsetWidth: {number} 元素的完整宽度（单位为像素，包含内容、内边距和边框）
 * - offsetHeight: {number} 元素的完整高度（单位为像素，包含内容、内边距和边框）
 * - pageX: {number} 元素在文档中左上角相对于页面左侧的坐标（单位为像素）
 * - pageY: {number} 元素在文档中左上角相对于页面顶部的坐标（单位为像素）
 * - windowX: {number} 元素在窗口中的X坐标（单位为像素）
 * - windowY: {number} 元素在窗口中的Y坐标（单位为像素）
 * - isInViewport: {boolean} 表示元素是否在可见视口内
 * 
 * @throws {Error} 当传入的 element 参数未定义时抛出错误
 */
export default function getElementInfo(element: HTMLElement) {
  if (!element) throw new Error("Element is not defined");

  const rect = element.getBoundingClientRect();

  // 使用 getComputedStyle 获取边框大小
  const styles = window.getComputedStyle(element);
  const borderWidth = parseFloat(styles.borderLeftWidth) + parseFloat(styles.borderRightWidth);
  const borderHeight = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);

  // 检查元素是否在视口内
  const isInViewport = rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth);

  return {
    width: rect.width,                 // 元素的宽度
    height: rect.height,               // 元素的高度
    top: rect.top,                     // 相对于视口的顶部距离
    left: rect.left,                   // 相对于视口的左侧距离
    bottom: rect.bottom,               // 相对于视口的底部距离
    right: rect.right,                 // 相对于视口的右侧距离
    offsetTop: element.offsetTop,      // 相对于文档的顶部距离
    offsetLeft: element.offsetLeft,    // 相对于文档的左侧距离
    borderWidth: borderWidth,          // 元素的边框宽度
    borderHeight: borderHeight,        // 元素的边框高度
    clientWidth: element.clientWidth,  // 内容区宽度（包括内边距，不包括边框）
    clientHeight: element.clientHeight,// 内容区高度（包括内边距，不包括边框）
    offsetWidth: element.offsetWidth,  // 完整宽度（包括内容、内边距和边框）
    offsetHeight: element.offsetHeight,// 完整高度（包括内容、内边距和边框）
    pageX: window.scrollX + rect.left, // 元素在文档中的X坐标
    pageY: window.scrollY + rect.top,  // 元素在文档中的Y坐标
    windowX: rect.left,                // 元素在窗口中的X坐标
    windowY: rect.top,                 // 元素在窗口中的Y坐标
    isInViewport: isInViewport         // 判断元素是否在视口范围内
  };
}
