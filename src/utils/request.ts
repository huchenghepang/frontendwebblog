import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useUserStoreWithOut } from '../stores/modules/user';
import app from '@/main';
import { config } from '@/config/config';

const userStore = useUserStoreWithOut();


// 创建 axios 实例
const instance = axios.create({
    baseURL: config.apiBaseUrl as string,
    timeout: 30000,
    withCredentials:import.meta.env.DEV ? true:false, // 允许跨域请求时发送凭据（例如 cookies）
    credentials: 'include', // 必须启用以发送和接收 Cookie
} as AxiosRequestConfig);

/**
 * 请求拦截器函数。
 * 添加授权 token 到请求头中，并启动进度条。
 * 
 * @param {InternalAxiosRequestConfig} config - 请求配置对象。
 * @returns {InternalAxiosRequestConfig} - 修改后的配置对象，包括 headers。
 */
function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    if (userStore.jwtToken) {
        config.headers = {
            ...config.headers,
            'Authorization': `${userStore.jwtToken}`
        } as AxiosRequestHeaders;
    }
    nprogress.start();
    return config;
}

/**
 * 响应拦截器函数。
 * 处理响应数据，停止进度条，并返回响应数据。
 * 
 * @param {AxiosResponse} response - Axios 响应对象。
 * @returns {any} - 响应数据。
 */
function responseInterceptor(response: AxiosResponse) {
    nprogress.done();
    return response.data;
}

/**
 * 响应错误拦截器函数。
 * 处理错误时停止进度条，并弹出网络错误提示。
 * 
 * @param {any} error - 错误对象。
 * @returns {Promise<never>} - 返回拒绝的 Promise。
 */
function responseErrorInterceptor(error: any): Promise<never> {
    if (error.message === 'Network Error') {
        app.config.globalProperties.$message({
            text: "无法获取网络,或者服务器失联中...",
            type: "error"
        });
    }
    nprogress.done();
    return Promise.reject(error);
}

// 使用拦截器
instance.interceptors.request.use(requestInterceptor, function (error) {
    nprogress.done();
    // 对请求错误做些什么 可以选择抛出或者不抛出 
    return Promise.reject(error);
});

instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default instance;
