import type { ApiResponse } from "@/types/customResponse"
import instance from "@/utils/request"


/* 获取角色信息 */
export const reqGetRolesList = async (pagination:PaginationParams):Promise<RoleApiResponse>=>{
    return await instance({url:"/role",params:pagination,method:"get"})
}

/* 查找角色 */
export const reqFindRoleByName = async (roleName):Promise<ApiResponse>=>{
    return await instance({url:`/role/get/${roleName}`,method:"get"})
}

/* 添加角色 */
export const reqAddRole = async (data:addRoleParam):Promise<ApiResponse>=>{
    return await instance({url:"/role/add",method:"post",data})
}

/* 更新角色 */
export const reqUpdateRole = async (data:addRoleParam,roleId:number):Promise<ApiResponse>=>{
    return await instance({url:`/role/update/${roleId}`,method:"put",data})
}

/* 获取角色的权限信息 */
export const reqGetRolePermissions = async (roleId:number):Promise<ApiResponse>=>{
    return await instance({url:`/role/permissions/${roleId}`,method:"get"})
}

/* 分配角色的权限 */
export const reqAssignPermissions = async (data:PermissionAssignment):Promise<ApiResponse>=>{
    return await instance({url:"/role/managePermissions",method:"post",data})
}

/* 删除角色 */

export const reqDeleteRole = async (roleId:number):Promise<ApiResponse>=>{
    return await instance({url:`/role/delete/${roleId}`,method:'delete'})
}

/* 批量删除角色 */
export const reqDeleteBatchRole = async (data:{ids:number[]}):Promise<ApiResponse>=>{
    return await instance({url:`/role/batch`,method:'delete',data})
}