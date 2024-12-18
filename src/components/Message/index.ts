import { createVNode, render } from 'vue'
import myMessage from '@/components/Message/Message.vue'
// 动态创建一个DOM容器
 interface Message {
    text: string;
    type:"success"|"error"|'warn';
    duration?: number; // 持续时间，单位为秒，默认为3秒
 }
export default ({ text, type, duration = 3000 }:Message) => {
    let timer = null
    //createVNode 用于创建一个虚拟节点
    // 参数1 支持组件
    // 参数2 表示传递给组件的选项
 
    const div = document.createElement('div')
    
    // const div = document.body
    div.setAttribute('class', 'my-message-container')
    
    // console.log(myMessage);
    const vnode = createVNode(myMessage, { text, type })
    //把虚拟的节点渲染到页面的DOM中即可
    // render函数的参数
    //参数一：表示表示需要渲染的内容（虚拟节点）
    // 参数二：表示渲染的目标位置 （DOM元素）
    render(vnode, div)
 
    const a= document.body.appendChild(div)
    timer = setTimeout(() =>
        setTimeout(() => {
            // render(null, div)
            document.body.removeChild(a);
        }, duration * 1.5)
    ); // 显示3秒钟后自动关闭
}