import { defineStore } from "pinia";
import type { ElementInfo } from "@/utils/getElementInfo"
import getElementInfo from '@/utils/getElementInfo'
import { getLocalStorage, setLocalStorage } from "@/utils/localStorage";

interface CenterState {
    isCollapseScrollBar: boolean;
    sideBarShapeInfo: Partial<ElementInfo>;  // 假设 `ElementInfo` 是一个复杂类型
    navBarShapeInfo: Partial<ElementInfo>;   // 如果需要，可以用 `Partial` 来允许可选属性
    tagViewShapeInfo: Partial<ElementInfo>;
    appMainShapeInfo: Partial<ElementInfo>;
    layoutComponentShapeInfo: Partial<ElementInfo>;
}

interface paramsType {
    sideBarShapeInfo: string;
    navBarShapeInfo: string;   // 如果需要，可以用 `Partial` 来允许可选属性
    tagViewShapeInfo: string;
    appMainShapeInfo: string;
    layoutComponentShapeInfo:string
}

const useCenterStore = defineStore('centerStore', {
    state():CenterState {
        return {
            isCollapseScrollBar: getLocalStorage('isCollapseScrollBar') ?? true,
            sideBarShapeInfo: {

            },
            navBarShapeInfo: {

            },
            tagViewShapeInfo: {

            },
            appMainShapeInfo: {

            },
            layoutComponentShapeInfo:{

            }
        } as CenterState
    },
    actions: {
        toggleCollapseScrollBar() {
            this.isCollapseScrollBar = !this.isCollapseScrollBar;
            // @ts-ignore
            setLocalStorage("isCollapseScrollBar",this.isCollapseScrollBar)
        },
        setElementShapeInfo(element:HTMLElement,param:keyof paramsType):ElementInfo{            
            const shapeInfo =  getElementInfo(element);
            this[param] = shapeInfo
            return shapeInfo
        }
    }


})

export default useCenterStore