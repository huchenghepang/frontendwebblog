/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Socket 连接地址
    VITE_SOCKET_URL: string;
    // 基本 API 地址
    VITE_APP_BASE_URL: string;
    // 应用标题
    VITE_APP_TITLE: string;
    // 图片上传地址
    VITE_APP_BASE_URL_UPLOAD_URL: string;
    VITE_APP_BASE_URL_UPLOAD_SINGLE_URL:string;
    // 笔记图片的请求路径
    VITE_APP_BASE_URL_DOWNLOAD_PATH: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
