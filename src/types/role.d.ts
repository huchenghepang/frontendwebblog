// 定义角色数据项类型
interface RoleInfo {
    role_id: number;       // 角色ID
    role_name: string;     // 角色名称
    description: string;   // 角色描述
    created_at: string | null; // 角色创建时间
    updated_at: string | null; // 角色更新时间
}

// 定义分页信息类型
interface Pagination {
    total: number;         // 总记录数
    totalPages: number;    // 总页数
    page: number;          // 当前页数
    limit: number;         // 每页记录数
    roles?: RoleInfo[];         // 角色数据数组
}

// 定义响应数据的类型
interface RoleApiResponse {
    success: boolean;      // 请求是否成功
    code: number;          // 响应状态码
    message: string;       // 响应消息
    data: Pagination;      // 分页数据
    error: string | null;  // 错误信息
    timestamp: string;     // 时间戳
    requestId: string;     // 请求ID
}

/* 添加的请求参数 */
interface addRoleParam {
    roleName: string,
    description: string,
}



/* 角色的权限 */
interface rolePermissionType {
    id: number,
    name: string,
    parentId: null | number,
    type: permissionType,
    children: rolePermissionType[],
    hasPermission: boolean
}
/* 分配的权限参数 */
interface PermissionAssignment {
    roleId: number; // 角色 ID
    permissionIds: number[]; // 权限 ID 数组
}

