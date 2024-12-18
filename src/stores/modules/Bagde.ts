import { defineStore } from "pinia";


/* 这里定义的是侧边栏的提醒 */

// 定义状态类型，Bagde 模块的状态
interface BagdeState {
    default:0;
    unAnsweredCoumt:number; // 没有回复的数量
    unReviewCount:number;// 没有审核的评论数量
  // 在此处添加状态的其他字段并为其定义类型
  // 示例：count: number;

}

const useBadgeStore = defineStore('BagdeStore', {
  state(): BagdeState {
    return {
        default:0,
        unAnsweredCoumt:0,
        unReviewCount:0
      // 在这里初始化其他状态字段
    };
  },
  actions: {
    // 在这里定义用于改变状态的actions
    reviseUnAnsweredCoumt(value:number){
        this.unAnsweredCoumt = value
    }

  },
  getters: {
    // 在这里定义获取状态的getters
  }
});

// Bagde 仓库 - 该仓库管理 Bagde 模块的状态
export default useBadgeStore;