<!-- Notification.vue -->
<template>
    <div class="notification-container">
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="notification"
        :class="notification.type"
        @click="closeNotification(index)"
      >
        <span class="message">{{ notification.message }}</span>
        <button class="close-btn" @click.stop="closeNotification(index)">×</button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  // 定义通知类型
  type NotificationType = 'info' | 'success' | 'warning' | 'error';
  
  // 定义通知对象类型
  interface Notification {
    type: NotificationType;
    message: string;
    duration: number; // 持续显示的时间（毫秒）
  }
  
  const notifications = ref<Notification[]>([]);
  
  // 添加通知的方法
  function addNotification(message: string, type: NotificationType = 'info', duration: number = 3000) {
    const newNotification: Notification = { type, message, duration };
    notifications.value.push(newNotification);
  
    // 自动关闭通知
    setTimeout(() => {
      closeNotification(0);  // 关闭第一个通知
    }, duration);
  }
  
  // 关闭通知的方法
  function closeNotification(index: number) {
    notifications.value.splice(index, 1);
  }
  
  // 暴露方法给外部使用
  defineExpose({
    addNotification
  });
  </script>
  
  <style scoped lang="scss">
  .notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 300px;
  }
  
  .notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    animation: fadeIn 0.3s forwards;
  
    &.info {
      background-color: #3498db;
    }
    &.success {
      background-color: #2ecc71;
    }
    &.warning {
      background-color: #f39c12;
    }
    &.error {
      background-color: #e74c3c;
    }
  
    .message {
      flex-grow: 1;
    }
  
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 0;
      margin-left: 8px;
    }
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  </style>
  