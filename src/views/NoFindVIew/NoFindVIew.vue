<template>
    <div class="not-found">
      <div class="not-found-container">
        <h1 class="error-code">404</h1>
        <p class="message">抱歉，您访问的页面不存在。</p>
        <button class="back-btn" @click="goHome">返回首页</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goHome = () => {
    router.push('/');
  };
  </script>
  
  <style scoped lang="scss">
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc( 100vh - $header-height);
    background: #f3f4f6;
    font-family: 'Arial', sans-serif;
  }
  
  .not-found-container {
    text-align: center;
    background-color: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease-out;
  }
  
  .error-code {
    font-size: 100px;
    font-weight: bold;
    color: #f44336;
    margin: 0;
    animation: bounce 1.5s infinite alternate;
  }
  
  .message {
    font-size: 18px;
    color: #333;
    margin-top: 10px;
  }
  
  .back-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .back-btn:hover {
    background-color: #45a049;
  }
  
  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
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
  