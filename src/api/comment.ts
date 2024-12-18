import type { ToggleCommentLikeRequest,AddCommentRequest,DeleteCommentRequest,
    EditCommentRequest,
    AuditCommentRequest,
    QueryCommentRequest,
    DeleteCommentsRequest,
    AuditCommentsRequest,
    GetCommentsByAdminRequest
 } from "@/types/comment"
import type { ApiResponse } from "@/types/customResponse"
import instance from "@/utils/request"

/* 添加评论 */
export const reqAddComment = async (data: AddCommentRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/add`, method: "post", data })
}

/* 删除评论 */
export const reqDeleteComment = async (data: DeleteCommentRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/remove`, method: "post", data })
}

/* 编辑评论 */
export const reqEditComment = async (data: EditCommentRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/edit`, method: "post", data })
}

/* 审核评论 */
export const reqAuditComment = async (data: AuditCommentRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/audit`, method: "post", data })
}

/* 获取文章的评论 */
export const reqGetCommentsByArticle = async (data: QueryCommentRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/get`, method: "post", data })
}

/* 获取用户的评论 */
export const reqGetCommentsByUser = async (data: {userId:string}): Promise<ApiResponse> => {
    return await instance({ url: `/comment/user`, method: "post", data })
}

/* 切换评论的点赞状态 */
export const reqToggleCommentLike = async (data: ToggleCommentLikeRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/togglelike`, method: "post", data })
}

/* 管理员获取所有评论 */
export const reqGetCommentsByAdmin = async (data: GetCommentsByAdminRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/admin`, method: "post", data })
}

/* 管理员删除评论 */
export const reqDeleteCommentsAdmin = async (data: DeleteCommentsRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/admin/delete`, method: "post", data })
}

/* 批量审核评论 */
export const reqAuditCommentsAdmin = async (data: AuditCommentsRequest): Promise<ApiResponse> => {
    return await instance({ url: `/comment/admin/batch/review`, method: "post", data })
}

/* 获取还未审核的评论数量 */
export const reqNoReviewCommentCount = async (): Promise<ApiResponse> => {
    return await instance({ url: `/comment/admin/noreview`, method: "post" })
}
