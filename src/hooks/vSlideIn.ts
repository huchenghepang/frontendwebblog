const DISTANCE = 150;
const DURATION = 500;
const map = new WeakMap()
/* 创建观察器 */
const ob = new IntersectionObserver((entries)=>{
    // console.log(entries);
    for (const entry of entries) {
        if(entry.isIntersecting){
            /* 元素与视口相交 */
            const animation = map.get(entry.target)
            if(animation){
                animation.play();
                ob.unobserve(entry.target);
            }
        }
    }
    
})


function isBelowViewPort(el:HTMLElement){
    const rect = el.getBoundingClientRect();
    return rect.top - DISTANCE > window.innerHeight
}

import type { DirectiveBinding } from 'vue'; // 仅类型导入
const vSlideIn = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        
        /* 在视口之下才进行 */
        if(!isBelowViewPort(el)){
            return;
        }
        const animation = el.animate([
            {
                transform: `translateY(${DISTANCE}px)`,
                opacity: 0.5
            },
            {
                transform:'translateY(0px)',
                opacity:1
            }
        ],{
            duration:DURATION,
            easing:"ease-in-out",
            fill:"forwards",
        });
        

        animation.pause();
        ob.observe(el);
        map.set(el,animation)


    },
    unmounted(el:HTMLElement) {
        ob.disconnect()
    },
}

export default vSlideIn

