interface UserInfo {
    account: string;      // 用户账号
    avatar: string;       // 用户头像 URL
    currentRole: roleType;  // 当前角色
    email: string;        // 用户邮箱
    isLogin: boolean;     // 登录状态
    signature: string;    // 用户签名
    username: string;     // 用户名
    userId: string;       // 用户 ID
    [key: string]: any; // 允许其他任意键值对
}



interface UserData {
    index: number;                           // 用户索引
    user_id: string;                         // 用户唯一 ID
    account: string;                         // 用户账号
    password: string;                        // 用户密码（可能为空）
    register_datetime: string;               // 注册时间
    is_login: string;                        // 是否登录 (1 表示已登录)
    is_delete: number;                       // 是否删除 (0 表示未删除)
    username: string;                        // 用户名
    role: string | null;                     // 用户角色
    avatar: string;                          // 用户头像 URL
    email: string;                           // 用户邮箱
    signature: string;                       // 用户签名
    roles: Role[];                           // 用户的所有角色
    currentRole: Role;                       // 当前角色
    permissions: Permission[];               // 用户权限
    iat: number;                             // Token 颁发时间
    exp: number;                             // Token 过期时间
}
interface Role {
    roleId: number | null;                         // 角色 ID
    roleName: string;                       // 角色名称
}

interface Permission {
    permissionId: number;      // 权限ID
    permissionName: string;    // 权限名称
    parentId: number | null;   // 父权限ID，可能为空
    type: "route" | "button";  // 权限类型，可能是 "route" 或 "button"
    description: string;       // 权限描述
    children: Permission[];    // 子权限，递归引用自身
}



interface roleType {
    roleId: number | null
    roleName: string
}

/* 添加用户 */
interface addUserParam {
    account: string,
    password: string
}


/* 分配用户角色 */
interface assignUserRoleParam {
    userId: string,
    roleIds: number[]
}

/* 用户信息的响应 */
interface userInfoResponse {
    "user_id": string,
    "account": string,
    "register_datetime": string,
    "is_delete": 0 | 1,
    "username": string
}

