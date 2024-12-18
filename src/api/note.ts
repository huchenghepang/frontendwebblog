import type { ApiResponse } from "@/types/customResponse"
import instance from "@/utils/request"

/* 获取所有的文章数据 */
export const reqGetNotesPageLimit = async (params:PaginationParams):Promise<ApiResponse> =>{
    return await instance({url:`/note/info`,method:'get',params})
}

/* 添加文章 */
export const reqAddNote = async (data: AddNoteRequest): Promise<ApiResponse> => {
    return await instance({ url: `/note/add`, method: "post",data })
}

/* 更新文章 */
export const reqUpdateNote = async (data: UpdateNoteRequest): Promise<ApiResponse> => {
    return await instance({ url: `/note/update`, method: "post",data })
}

/* 删除文章 */
export const reqDeleteNote = async (params:DeleteNoteRequest):Promise<ApiResponse> =>{
    return await instance({url:"/note/delete",method:'delete',params})
}

/* 切换文章的归档的状态 */
export const reqToggleArchiveNote = async (params:ToggleArchiveNoteRequest):Promise<ApiResponse> =>{
    return await instance({url:`/note/archive`,method:'get',params})
}

/* 根据文章的Id获取标签信息 */
export const reqNoteTags = async (noteId:number):Promise<ApiResponse> =>{
    return await instance({url:`/note/tags`,method:'post',data:{noteId}})
}

/* 根据文章的Id获取文章的内容 */
export const reqNoteTContent= async (noteId:number):Promise<ApiResponse> =>{
    return await instance({url:`/note/content`,method:'post',data:{noteId}})
}
