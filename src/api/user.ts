// 登录请求
import request from '../utils/request'
import type { ApiResponse, UserProfile } from '@/types/customResponse';

export const reqLogin = async (data: { account: string, password: string }) => await request({ url: "/api/login", method: "POST", data })

// 注册请求
export const reqRegister = async (data: { account: string, password: string }) => await request({ url: "/api/register", method: "POST", data })

// 请求用户信息
export const reqGetUserInfo = async (data:{type?:number | number,roleId?:number | null}):Promise<ApiResponse> => await request({ url: `/user/userinfo`,params:data,method: "get", timeout: 2000 })

/* 获取验证码 */
export const reqCaptcha = async () => await request({ url: "/api/captcha", method: "get", timeout: 2000 });

// 修改用户信息
export const reqUpdateUserInfo = async (data: UserProfile):Promise<ApiResponse> => await request({ url: "/user/update/userinfo", method: "post", data })

