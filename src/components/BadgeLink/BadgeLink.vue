<template>
  
  <el-badge :hidden="badgeValue === 0" :value="badgeValue" :max="99" :is-dot="isDot" class="badge-link"
    :offset="[badgeOffset.x, badgeOffset.y]" :style="{ cursor: 'pointer' }" @click="navigateToRoute">
    <slot></slot> <!-- 插槽允许传递自定义内容，比如图标或文本 -->
  </el-badge>


</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { defineProps } from 'vue';
  import useBadgeStore from '@/stores/modules/Bagde';
  // 获取 BadgeStore 的类型定义
  type BadgeStoreState = ReturnType<typeof useBadgeStore>['$state'];
  // 定义组件的 props
  const props = defineProps({
    // 路由名字
    routeName: {
      type: String,

    },
    // 徽章名字
    badgeName: {
      type: String as () => keyof BadgeStoreState,
      default: ""
    },
    isDot: {
      type: Boolean,
      default: false,
    },
    badgeOffset: {
      type: Object as () => { x: number; y: number },
      default: () => ({
        x: 5,
        y: -5,
      }),
    },
    // 跳转前事件
    onBeforeNavigate: {
      type: Function as () => void,
      default: () => { }
    },
  });

  // 使用 vue-router 的 hook 获取路由实例
  const router = useRouter();
  const badgeStore = useBadgeStore();

  // 动态计算徽章值
  const badgeValue = computed(() => {
    if (typeof props.badgeName === 'string' && props.badgeName in badgeStore) {
      const value = badgeStore[props.badgeName as keyof typeof badgeStore] || 0;
      if (typeof value == "number" || typeof value == "string") {
        return value
      } else {
        return 0
      }
    }
    return 0;
  });

  // 路由跳转的方法
  const navigateToRoute = () => {
    if (typeof props.onBeforeNavigate === 'function') {
      // @ts-ignore
      props.onBeforeNavigate(); // 调用跳转前回调
    }
    router.push({ name: props.routeName });
  };
</script>

<style scoped>
  .badge-link {
    display: inline-flex;
    align-items: center;
  }
</style>
