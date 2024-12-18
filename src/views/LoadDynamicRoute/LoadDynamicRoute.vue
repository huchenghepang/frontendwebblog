<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p class="loading-text">正在加载页面，请稍候...</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { getLocalStorage } from "@/utils/localStorage";
  import { createDynamicRoutes } from "@/router";

  const router = useRouter();
  const route = useRoute();


  const TIMEOUT = 5000; // 超时时间，单位毫秒
  let timeoutId: number | null = null;

  // 动态加载路由并处理重定向
  async function loadRoute(redirectPath: string) {
    try {
      // 防止重定向到当前页面
      if (redirectPath === route.fullPath) {
        console.warn("Redirect target is the current page, cancelling navigation.");
        return;
      }

      if (redirectPath.startsWith("/center")) {
        await router.replace({ path: redirectPath });
      } else {
        router.push("/404");
      }
    } catch (err) {
      console.error("Navigation Error:", err);
      router.push("/404");
    }
  }

  // 页面挂载时初始化
  onMounted(async () => {
    try {
      // 设置超时跳转逻辑
      timeoutId = window.setTimeout(() => {
        console.error("Loading timeout, redirecting to /404...");
        router.push("/404");
      }, TIMEOUT);

      // 创建新的路由
      const newPermission = getLocalStorage("permissions");
      await createDynamicRoutes(newPermission, []);
      const redirectPath = (route.query.redirect as string) || "";

      // 加载重定向路由
      if (redirectPath) {
        await loadRoute(redirectPath);
      } else {
        router.push("/404");
      }
    } catch (err) {
      console.error("Error loading user info or route:", err);
      router.push("/404");
    } finally {
      // 清理定时器
      if (timeoutId) clearTimeout(timeoutId);
    }
  });
</script>
<style scoped lang="scss">

  /* 外层容器样式 */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #f2f3f3, #c5d0d1);
    color: #fff;
    font-family: Arial, sans-serif;
    text-align: center;
  }

  /* 加载文字样式 */
  .loading-text {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 20px;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  }

  /* 加载动画样式 */
  .spinner {
    width: 50px;
    height: 50px;
    border: 6px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* 动画效果 */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>