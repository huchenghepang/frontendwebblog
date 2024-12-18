// 自定义响应内容


/* 常用的返回状态码 */
// 定义常用的 HTTP 状态码枚举
export enum HttpStatusCode {
    OK = 200,                    // 请求成功
    Created = 201,               // 资源创建成功
    Accepted = 202,              // 请求已接受，但未处理完成
    NoContent = 204,             // 请求成功，但无返回内容
    BadRequest = 400,            // 请求无效
    Unauthorized = 401,          // 未授权
    Forbidden = 403,             // 禁止访问
    NotFound = 404,              // 请求的资源未找到
    InternalServerError = 500,   // 服务器内部错误
    ServiceUnavailable = 503     // 服务不可用
}

import type { AxiosResponse } from "axios";

// 定义响应数据的接口
interface ResponseData<T = any> {
    code: HttpStatusCode | number;         // 响应状态码
    message: string;      // 响应信息
    data?: T;            // 可选的数据，类型为 T，默认值为 any
    [key: string]: any;   // 可选的扩展属性
}

interface CountItem {
    note_count: number;
    category_name?: string; // 对于 categoryCounts，可能会有 category 字段
    tag_name?: string;
    reading?:number,
    level?:number
}

interface StatisticsData {
    categoryCounts: CountItem[];
    tagCounts: CountItem[];
}



interface ApiResponse<T = any> extends AxiosResponse {
    success: boolean;              // 请求是否成功
    code?: HttpStatusCode | number;                 // HTTP 状态码或自定义状态码
    message: string;              // 操作结果的描述
    data: T;              // 返回的数据内容，泛型可以根据具体情况指定
    error: ApiError | null;      // 错误信息，如果有的话
    timestamp: string;            // 响应生成的时间戳
    requestId: string;            // 唯一的请求 ID
    meta?: ApiMeta;              // 额外的元数据（可选）
    ErrorMessage?:string
}


interface ApiError {
    code: HttpStatusCode | number;                 // 错误代码
    description: string;          // 错误描述
}

interface ApiMeta {
    pagination?: Pagination;      // 分页信息（可选）
    version: string;              // API 版本号
}

interface Pagination {
    currentPage: number;          // 当前页码
    totalPages: number;           // 总页数
    totalItems: number;           // 总记录数
}

// 定义接口类型
interface UserProfile {
    username: string;  // 用户名，必填
    avatar: string;    // 头像地址，必填
    email: string;     // 邮箱，必填
    signature: string; // 个性签名，必填
}


/* 权限的相应数据 */
// 定义单个权限项的类型（字段保持原有形式）
interface SinglePermission {
    permission_id: number; // 权限 ID
    permission_name: string; // 权限名称
    permission_value:string;// 权限值
    description: string; // 权限描述
    type: "route" | "button"; // 权限类型
    parent_id: number | null; // 父级 ID，null 表示顶级
    can_delete:0 | 1; // 是否能够被删除
    children: Permission[]; // 子权限列表
}
