import type { ApiResponse } from "@/types/customResponse";
import instance from "@/utils/request";


/* 添加分类 */
export const reqAddCategory = async (data:CategoryParam):Promise<ApiResponse>=> await instance({url:"/category/addcategory",method:'post',data})
/* 更新分类 */
export const reqUpdateCategory = async (id:number,data:CategoryParam):Promise<ApiResponse>=> await instance({url:`/category/updatecategory/${id}`,method:'post',data})
/* 删除分类 */
export const reqDeleteCategory = async (id:number):Promise<ApiResponse> => await instance({url:`/category/removecategory`,method:"get",params:{id}})