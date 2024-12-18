import type { ApiResponse } from '@/types/customResponse'
import request from '../utils/request'

/* 获取所有权限的信息 */
export const reqPermissionsInfo = async ()=>{
    return await request({url:"/permission/getpermissions"})
}

/* 更新当前的权限 */
export const reqUpdatePermission = async (id:number,data:PermissionParamData):Promise<ApiResponse>=>{
    return await request({url:`/permission/update/${id}`,data,method:"put"})
}

/* 删除当前的权限 */
export const  reqDeleteCurrentPermission = async (id:number):Promise<ApiResponse>=>{
    return await request({url:`/permission/delete/${id}`,method:"delete"})
}

/* 添加权限 */
export const reqAddPermission = async (data:PermissionParamData):Promise<ApiResponse>=>{
    return await request({url:`/permission/addpermission`,method:"post",data})
}
