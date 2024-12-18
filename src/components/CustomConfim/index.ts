import { createVNode, render } from 'vue'
import CustomConfirm from '@/components/CustomConfim/CustomConfirm.vue';
// 动态创建一个DOM容器

export default ({ title="自定义标题", message,close,cancel,confirm,isShowClose}:CustomConfirm) => {
    //createVNode 用于创建一个虚拟节点
    // 参数1 支持组件
    // 参数2 表示传递给组件的选项
 
    const div = document.createElement('div')
    
    // const div = document.body
    div.setAttribute('class', 'my-confirm-container')
    
    // console.log(myMessage);
    const vnode = createVNode(CustomConfirm, { title, message,close,cancel,confirm,isShowClose})
    //把虚拟的节点渲染到页面的DOM中即可
    // render函数的参数
    //参数一：表示表示需要渲染的内容（虚拟节点）
    // 参数二：表示渲染的目标位置 （DOM元素）
    render(vnode, div)
 
 
    const realNode:any= document.body.appendChild(div)
    // 打开遮罩对话框
    realNode.firstChild.showModal()
    
}