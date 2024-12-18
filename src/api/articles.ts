
import type { ApiResponse, StatisticsData } from '@/types/customResponse';
import request from '../utils/request'




/**
 * 获取分类列表信息
 * @date 2024-11-03 06:12:13
 * @author jeff-护城河
 *
 * @returns {*}
 * @example 示例
 */
export const reqGetArticlesCategories: ()=>Promise<ApiResponse> = async () => await request({ url: "/api/getcategory", method: "get", timeout: 6000 });



/**
 * 添加文章
 * @date 2024-11-04 06:09:09
 * @author jeff-护城河
 *
 * @param {{noteName:string,Tags:string,datetime:string,fileId:number,isArchive:Boolean,category:string}} data
 * @returns {*}
 * @example 示例
 */
export const reqAddArticle = async (data: { noteName: string, Tags: string, datetime: string, fileId: string, isArchive: boolean, category: string }):Promise<ApiResponse> => {
    return await request({ url: "/note/addarticle", method: "post", data, timeout: 6000 })
}





type GetArticlesParams = {
    pageSize?: number;         // 每页显示的记录数
    page?: number;             // 页码
    keyword?: string;          // 关键字
    tagName?: string;          // 标签名称
    datetimeStart?: string;    // 开始日期时间，格式为 'YYYY-MM-DD HH:mm:ss'
    datetimeEnd?: string;      // 结束日期时间，格式为 'YYYY-MM-DD HH:mm:ss'
    categoryName?: string;     // 分类名称
};
// 获取文章数据
export async function reqGetArticles<T extends GetArticlesParams>(params: T):Promise<ApiResponse>{
    return await request({ url: "/api/getarticles", method: "get", params, timeout: 4000 })
}

// 获取在线文章的内容

export const reqGetContentArticle = async (fileId:string):Promise<ApiResponse>=>{
    return await request({ url: `/api/getArticleContent?fileId=${fileId}`, method: "get"})
}
// 获取统计数据
export async function reqGetStatistics():Promise<ApiResponse<StatisticsData>>{
    return await request({url:`/api/getArticleAnalyzeData`,method:"get"});
}
