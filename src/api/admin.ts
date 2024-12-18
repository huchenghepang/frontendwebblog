import type { ApiResponse } from '@/types/customResponse'
import request from '../utils/request'


/* 添加用户 */
export const reqAddUser = async (data: addUserParam): Promise<ApiResponse> => await request({ url: "/user/admin/add", method: "post", data })
/* 获取用户的信息 */
export const reqGetUsersList = async (data: PaginationParams): Promise<ApiResponse> => await request({ url: "/user/admin/users", params:data })
/* 重置用户密码 */
export const reqResetUserPassword = async (userId: string): Promise<ApiResponse> => await request({ url: `/user/admin/reset/${userId}`, method: "put" })
/* 删除用户 */
export const reqDeleteUser = async (userId: string): Promise<ApiResponse> => await request({ url: `/user/admin/delete/${userId}`, method: "put" })
/* 批量删除用户：为了避免误操作不能批量删除用户 */

/* 获取用户角色信息 */
export const reqGetUserRoleInfo = async (userId: string): Promise<ApiResponse> => await request({
    url: `/user/userrole/${userId}`,
    method: "get"
})
/* 分配用户角色 */
export const reqAssignUserRole = async (data: assignUserRoleParam): Promise<ApiResponse> => await request({
    url: `/user/admin/manageRoles`,
    method: 'post',
    data
})

/* 更新用户信息：管理员不能去操作用户的信息，这涉及隐私 */

/* 根据用户名查找用户数据 */
export const reqFindUsersByName = async (userName:string):Promise<ApiResponse> =>await request({
    url:"/user/admin/getuser",
    method:'get',
    params:{userName}
})

