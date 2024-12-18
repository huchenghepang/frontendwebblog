// emitter.ts
import mitt from "mitt";
import { onMounted, onUnmounted } from "vue";

// 定义事件类型接口
type Events = {
  // 可以继续添加其他事件类型
  [key: string]: any; // 支持动态事件类型
};

// 创建 mitt 实例并强制推导事件类型
const emitter = mitt<Events>();

// 封装 useEvent 钩子
export function useEvent<T extends keyof Events>(eventName: T, handler: (data: Events[T]) => void) {
  // 绑定事件
  onMounted(() => {
    emitter.on(eventName, handler);
  });

  // 卸载事件
  onUnmounted(() => {
    emitter.off(eventName, handler);
  });
}

// 暴露 emitter 供外部触发事件
export default emitter;